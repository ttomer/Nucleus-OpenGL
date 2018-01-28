varying vec3 Texcoord_V;

void main() {
    Texcoord_V = position.xyz;

	gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
}