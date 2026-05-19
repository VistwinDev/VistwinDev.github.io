# register-machine.ps1 - one-time: add this machine to the fleet.
# Creates <hostname>.md with frontmatter, then runs heartbeat once.
param(
    [ValidateSet('home','lab','school')]
    [string]$Role = 'home'
)

$ErrorActionPreference = 'Stop'

$MachinesDir = Split-Path $PSScriptRoot -Parent
$Hostname    = $env:COMPUTERNAME.ToLower()
$User        = $env:USERNAME
$OS          = (Get-CimInstance Win32_OperatingSystem).Caption
$Today       = (Get-Date).ToString('yyyy-MM-dd')
$Now         = (Get-Date).ToString('yyyy-MM-dd HH:mm')
$MdPath      = Join-Path $MachinesDir "$Hostname.md"

if (Test-Path -LiteralPath $MdPath) {
    Write-Host "Already registered: $MdPath - refreshing heartbeat only."
} else {
    $fm = @"
---
machine: true
hostname: $Hostname
role: $Role
user: $User
os: $OS
created: $Today
last_check_in: $Now
tags: [machine, fleet]
---

# $Hostname

> Fleet node. Auto-maintained by ``heartbeat.ps1``. Do not hand-edit the
> HEARTBEAT block below.

<!-- HEARTBEAT:START -->
_Not yet run._
<!-- HEARTBEAT:END -->

## Related

- [[_fleet-index|Fleet Index]]
- [[../05 Claude Skills/dev-state-overview/SKILL|dev-state-overview]]
"@
    $enc = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($MdPath, $fm, $enc)
    Write-Host "Created $MdPath (role=$Role)"
}

& (Join-Path $PSScriptRoot 'heartbeat.ps1') -MdPath $MdPath
