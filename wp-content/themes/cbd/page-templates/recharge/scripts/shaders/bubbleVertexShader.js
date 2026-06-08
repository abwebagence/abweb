const bubbleVertexShader = `
varying vec3 worldNormal;
varying vec3 eyeVector;
varying vec2 vUv;

uniform float uTime;
uniform float uRipple;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  vec3 localSpacePosition = position;

  // Ripples
  float t = sin(localSpacePosition.y * 10.0 + uTime * 5.0);
  t = remap(t, -1.0, 1.0, 0.0, 0.02);
  localSpacePosition += t * normal * uRipple;

  vec4 worldPos = modelMatrix * vec4(localSpacePosition, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  eyeVector =  normalize(worldPos.xyz - cameraPosition);

  vUv = uv;
}
`

export default bubbleVertexShader
