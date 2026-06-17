[[XR]]

https://github.com/aras-p/UnityGaussianSplatting

# Gaussian Splatting playground in Unity

[](https://github.com/aras-p/UnityGaussianSplatting#gaussian-splatting-playground-in-unity)

SIGGRAPH 2023 had a paper "[**3D Gaussian Splatting for Real-Time Radiance Field Rendering**](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)" by Kerbl, Kopanas, Leimkühler, Drettakis that is really cool! Check out their website, source code repository, data sets and so on. I've decided to try to implement the realtime visualization part (i.e. the one that takes already-produced gaussian splat "model" file) in Unity.

[![Screenshot](https://github.com/aras-p/UnityGaussianSplatting/raw/main/docs/Images/shotOverview.jpg?raw=true "Screenshot")](https://github.com/aras-p/UnityGaussianSplatting/blob/main/docs/Images/shotOverview.jpg?raw=true)

Everything in this repository is based on that "OG" gaussian splatting paper. Towards end of 2023, there's a ton of [new gaussian splatting research](https://github.com/MrNeRF/awesome-3D-gaussian-splatting) coming out; _none_ of that is in this project.

⚠️ Status as of 2023 December: I'm not planning any significant further developments.

⚠️ The only platforms where this is known to work are the ones that use D3D12, Metal or Vulkan graphics APIs. PC (Windows on D3D12 or Vulkan), Mac (Metal), Linux (Vulkan) should work. Anything else I have not actually tested; it might work or it might not.

- Some virtual reality devices work (reportedly HTC Vive, Varjo Aero, Quest 3 and Quest Pro). Some others might not work, e.g. Apple Vision Pro. See [#17](https://github.com/aras-p/UnityGaussianSplatting/issues/17)
- Anything using OpenGL or OpenGL ES: [#26](https://github.com/aras-p/UnityGaussianSplatting/issues/26)
- WebGPU might work someday, but seems that today it does not quite have all the required graphics features yet: [#65](https://github.com/aras-p/UnityGaussianSplatting/issues/65)
- Mobile may or might not work. Some iOS devices definitely do not work ([#72](https://github.com/aras-p/UnityGaussianSplatting/issues/72)), some Androids do not work either ([#112](https://github.com/aras-p/UnityGaussianSplatting/issues/112))

## Usage

[](https://github.com/aras-p/UnityGaussianSplatting#usage)

Download or clone this repository, open `projects/GaussianExample` as a Unity project (I use Unity 2022.3, other versions might also work), and open `GSTestScene` scene in there.

Note that the project requires DX12 or Vulkan on Windows, i.e. **DX11 will not work**. This is **not tested at all on mobile/web**, and probably does not work there.

[![](https://github.com/aras-p/UnityGaussianSplatting/raw/main/docs/Images/shotAssetCreator.png)](https://github.com/aras-p/UnityGaussianSplatting/blob/main/docs/Images/shotAssetCreator.png)

Next up, **create some GaussianSplat assets**: open `Tools -> Gaussian Splats -> Create GaussianSplatAsset` menu within Unity. In the dialog, point `Input PLY/SPZ File` to your Gaussian Splat file. Currently two file formats are supported:

- PLY format from the original 3DGS paper (in the official paper models, the correct files are under `point_cloud/iteration_*/point_cloud.ply`).
- [Scaniverse SPZ](https://scaniverse.com/spz) format.

Optionally there can be `cameras.json` next to it or somewhere in parent folders.

Pick desired compression options and output folder, and press "Create Asset" button. The compression even at "very low" quality setting is decently usable, e.g. this capture at Very Low preset is under 8MB of total size (click to see the video):  
[![Watch the video](https://camo.githubusercontent.com/d02acf0de421d36569d21d56b11d1808d2c6c1ba893ec1f0d4d68e38dca6d9f6/68747470733a2f2f696d672e796f75747562652e636f6d2f76692f696363665630596c5756492f302e6a7067)](https://youtu.be/iccfV0YlWVI)

If everything was fine, there should be a GaussianSplat asset that has several data files next to it.

Since the gaussian splat models are quite large, I have not included any in this Github repo. The original [paper github page](https://github.com/graphdeco-inria/gaussian-splatting) has a a link to [14GB zip](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/datasets/pretrained/models.zip) of their models.

In the game object that has a `GaussianSplatRenderer` script, **point the Asset field to** one of your created assets. There are various controls on the script to debug/visualize the data, as well as a slider to move game camera into one of asset's camera locations.

The rendering takes game object transformation matrix into account; the official gaussian splat models seem to be all rotated by about -160 degrees around X axis, and mirrored around Z axis, so in the sample scene the object has such a transform set up.

Additional documentation:

- [Render Pipeline Integration](https://github.com/aras-p/UnityGaussianSplatting/blob/main/docs/render-pipeline-integration.md)
- [Editing Splats](https://github.com/aras-p/UnityGaussianSplatting/blob/main/docs/splat-editing.md)

_That's it!_