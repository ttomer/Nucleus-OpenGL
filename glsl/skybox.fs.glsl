// UNIFORMS
uniform samplerCube skybox;
varying vec3 Texcoord_V;

void main() {
//	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    gl_FragColor = textureCube(skybox, Texcoord_V);
}