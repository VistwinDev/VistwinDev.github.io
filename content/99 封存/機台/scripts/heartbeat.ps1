# heartbeat.ps1 - update this machine's fleet markdown.
# Run daily. Idempotent. ASCII-only on purpose (Windows PowerShell 5.1 safe).
param(
    [string]$MdPath
)

$ErrorActionPreference = 'Stop'

$MachinesDir = Split-Path $PSScriptRoot -Parent
$Hostname    = $env:COMPUTERNAME.ToLower()
if (-not $MdPath) { $MdPath = Join-Path $MachinesDir "$Hostname.md" }

if (-not (Test-Path -LiteralPath $MdPath)) {
    Write-Error "MD not found: $MdPath  (run register-machine.ps1 first)"
    exit 1
}

$VisRoot = Join-Path $HOME 'VisTwin'
$now     = (Get-Date).ToString('yyyy-MM-dd HH:mm')

# --- collect git repo states ---
$rows = @()
# git writes progress/errors to stderr; under Stop that aborts. Localize + helper.
function Invoke-Git {
    param([string]$Path, [string[]]$GitArgs)
    $eap = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    try { $out = & git -C $Path @GitArgs 2>$null }
    catch { $out = $null }
    finally { $ErrorActionPreference = $eap }
    return ($out | Out-String).Trim()
}

if (Test-Path -LiteralPath $VisRoot) {
    $dirs = Get-ChildItem -LiteralPath $VisRoot -Directory -ErrorAction SilentlyContinue |
            Where-Object { Test-Path (Join-Path $_.FullName '.git') }
    foreach ($d in $dirs) {
        $p = $d.FullName
        $branch = Invoke-Git $p @('branch','--show-current')
        if (-not $branch) { $branch = '(detached/none)' }
        $porc = Invoke-Git $p @('status','--porcelain')
        $dirty = if ($porc) { "dirty ($(@($porc -split "`n").Count))" } else { 'clean' }
        $last = Invoke-Git $p @('log','-1','--format=%h %s (%cr)')
        if (-not $last) { $last = '(no commits)' }
        $ahead  = Invoke-Git $p @('rev-list','--count','@{u}..HEAD')
        $behind = Invoke-Git $p @('rev-list','--count','HEAD..@{u}')
        if (-not ($ahead  -match '^\d+$')) { $ahead  = '-' }
        if (-not ($behind -match '^\d+$')) { $behind = '-' }
        $rows += "| $($d.Name) | $branch | $dirty | $ahead | $behind | $last |"
    }
}
if ($rows.Count -eq 0) { $rows = @("| _(no git repos under ~/VisTwin)_ |  |  |  |  |  |") }

# --- listening ports ---
$watch = 3000,3001,3002,3003,3004,3005,3006,3007,3008,3009,3010,8765,8766
$portList = @()
try {
    $portList = Get-NetTCPConnection -State Listen -ErrorAction Stop |
        Where-Object { $watch -contains $_.LocalPort } |
        Select-Object -ExpandProperty LocalPort -Unique | Sort-Object
} catch {}
$portsStr = if ($portList) { ($portList -join ', ') } else { '(none)' }

# --- visustwin-related processes ---
$procs = @()
try {
    $procs = Get-Process python,node,pythonw -ErrorAction SilentlyContinue |
        Where-Object { $_.Path -and $_.Path -like '*isustwin*' } |
        ForEach-Object { "$($_.ProcessName) (pid $($_.Id))" }
} catch {}
$procStr = if ($procs) { ($procs -join ', ') } else { '(none)' }

# --- rebuild body block ---
$body = @()
$body += '<!-- HEARTBEAT:START -->'
$body += "_Last heartbeat: ${now}_"
$body += ''
$body += '## Git repos (~/VisTwin)'
$body += ''
$body += '| Repo | Branch | State | Ahead | Behind | Last commit |'
$body += '|---|---|---|---|---|---|'
$body += $rows
$body += ''
$body += '## Listening ports'
$body += ''
$body += "Watched: $portsStr"
$body += ''
$body += '## VisTwin processes'
$body += ''
$body += $procStr
$body += '<!-- HEARTBEAT:END -->'
$bodyText = ($body -join "`r`n")

# --- read, patch frontmatter + body, write back (UTF-8 no BOM) ---
$raw = [System.IO.File]::ReadAllText($MdPath)
$lcEval   = [System.Text.RegularExpressions.MatchEvaluator]{ param($m) "last_check_in: $now" }
$bodyEval = [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $bodyText }
$raw = [regex]::Replace($raw, 'last_check_in:.*', $lcEval)
$raw = [regex]::Replace($raw,
        '(?s)<!-- HEARTBEAT:START -->.*?<!-- HEARTBEAT:END -->',
        $bodyEval)
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($MdPath, $raw, $enc)

Write-Host "heartbeat OK -> $MdPath ($now)"
