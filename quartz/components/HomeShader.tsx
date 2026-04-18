// @ts-ignore
import homeShaderScript from "./scripts/home-shader.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const HomeShader: QuartzComponent = ({ fileData }) => {
  if (fileData.slug !== "index") return null
  return <canvas id="dna-home-shader" aria-hidden="true" />
}

HomeShader.afterDOMLoaded = homeShaderScript

HomeShader.css = `
#dna-home-shader {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.10;
  mix-blend-mode: screen;
}
:root[saved-theme="light"] #dna-home-shader {
  opacity: 0.12;
  mix-blend-mode: multiply;
}
`

export default (() => HomeShader) satisfies QuartzComponentConstructor
