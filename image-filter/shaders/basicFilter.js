// language=WGSL
export const basicFilterShader = `
  struct Uniforms {
    brightness: f32,
    contrast: f32,
    exposure: f32,
    switchToLinear: f32,
  };

  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) ndc : vec2<f32>
  };

  @group(0) @binding(0) var samp: sampler;
  @group(0) @binding(1) var tex: texture_2d<f32>;
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  @vertex
  fn vs(@builtin(vertex_index) i: u32) -> VertexOutput {
    var output: VertexOutput;

    let quadPos = array<vec2<f32>, 4>(
      vec2(-1., -1.),
      vec2( 1., -1.),
      vec2(-1.,  1.),
      vec2( 1.,  1.)
    );

    let ndc = quadPos[i];

    output.Position = vec4<f32>(ndc, 0., 1.);
    output.ndc = quadPos[i];
    return output;
  }

  @fragment
  fn fs(@location(0) ndc : vec2<f32>) -> @location(0) vec4<f32> {
    let uv = (ndc * .5) + .5;
    var color = textureSample(tex, samp, uv);
    var c = color.rgb;

    // sRGB => linear
    let gamma = 2.2;
    if (uniforms.switchToLinear > 0.5) {
        c = pow(color.rgb, vec3(gamma));    
    }

    c += vec3(uniforms.brightness);

    let exposureFactor = pow(2., 2. * uniforms.exposure);
    c *= exposureFactor;
    
//    let black = vec3<f32>(0.02);
//    c = (c - black) / (exp2(-uniforms.exposure) - black);
    
    let contrastFactor = 1. + uniforms.contrast;
    c = (c - vec3(.5)) * contrastFactor + vec3(.5);

    // linear => sRGB
    if (uniforms.switchToLinear > 0.5) {
        c = pow(c, vec3(1. / gamma));
    }
    
    return vec4(c, color.a);
  }
`;
