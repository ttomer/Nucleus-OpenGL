//VARYING VAR
varying vec3 Normal_V;
varying vec3 Position_V;
varying vec4 PositionFromLight_V;
varying vec2 Texcoord_V;
uniform vec3 position3;

//UNIFORM VAR
// Inverse world matrix used to render the scene from the light POV
uniform mat4 lightViewMatrixUniform;
// Projection matrix used to render the scene from the light POV
uniform mat4 lightProjectMatrixUniform;
varying vec4 ShadowCoord;

void main() {
	Normal_V = normalMatrix * normal;
	Position_V = vec3(modelViewMatrix * vec4(position, 1.0));
	Texcoord_V = uv;


     mat4 trans = mat4(1.0, 0.0, 0.0, 0.0,
                       0.0, 1.0, 0.0, 0.0,
                       0.0, 0.0, 1.0, 0.0,
                        position3.x, position3.y, position3.z, 1.0);

//                        mat4 rotat = mat4(1.0, 0.0, 0.0, 0.0,
//                                               0.0, 1.0, 0.0, 0.0,
//                                               0.0, 0.0, 1.0, 0.0,
//                                                position.x, position.y, popsition.z, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * trans *  vec4(position, 1.0);

}