//VARYING VAR
varying vec3 Normal_V;
varying vec3 Position_V;
varying vec4 PositionFromLight_V;
varying vec2 Texcoord_V;

//UNIFORM VAR
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform vec3 lightDirectionUniform;

uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;

uniform float shininessUniform;

uniform sampler2D colorMap;
uniform sampler2D normalMap;
uniform sampler2D aoMap;
uniform sampler2D shadowMap;
varying vec4 ShadowCoord;

// PART D)
// Use this instead of directly sampling the shadowmap, as the float
// value is packed into 4 bytes as WebGL 1.0 (OpenGL ES 2.0) doesn't
// support floating point bufffers for the packing see depth.fs.glsl
float getShadowMapDepth(vec2 texCoord)
{
	vec4 v = texture2D(shadowMap, texCoord);
	const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0 * 256.0), 1.0/(256.0*256.0*256.0));
	return dot(v, bitShift);
}

void main() {







	// PART B) TANGENT SPACE NORMAL
	vec3 N_1 = normalize(texture2D(normalMap, Texcoord_V).xyz * 2.0 - 1.0);

	// PRE-CALCS
	vec3 N = normalize(Normal_V);

	vec3 L1 = normalize((viewMatrix * vec4(lightDirectionUniform, 0.0)).xyz);
    vec3 V1 = normalize(-Position_V);




	// AMBIENT
	vec3 texColor0 = texture2D(aoMap, Texcoord_V).xyz;
	vec3 light_AMB = kAmbientUniform*texColor0;

	// DIFFUSE
    vec3 texColor1 = texture2D(colorMap, Texcoord_V).xyz;

	vec3 diffuse = kDiffuseUniform * texColor1;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L1));

	// SPECULAR
//	vec4 normalc = texture2D(colorMap, Texcoord_V);
//	vec4 n = (2.0 * normalc)- 1.0;
	vec3 t = cross(N, vec3(0.0, 1.0, 0.0));
	vec3 b = cross(t, N);
    mat3 tbn = mat3(t.x, b.x, N.x,
                    t.y,b.y, N.y,
                    t.z, b.z, N.z);

    vec3 L =  normalize(tbn * vec3(viewMatrix * vec4(lightDirectionUniform, 0.0)));
    vec3 V = normalize(tbn * -Position_V);
    vec3 H = normalize(V + L);
	vec3 specular = kSpecularUniform * lightColorUniform;
	vec3 light_SPC = specular * pow(max(0.0, dot(H, N_1)), shininessUniform);



//	 TOTAL
	vec3 TOTAL = light_AMB + light_DFF  + light_SPC;

	vec4 shad = ShadowCoord/ShadowCoord.w;

	 float visibility = 1.0;
            if (getShadowMapDepth(shad.xy)  <  shad.z){
                visibility = 0.1;
            }

            TOTAL = TOTAL * visibility;

	// SHADOW
	// Fill in attenuation for shadow here

//	gl_FragColor = texColor0;
	gl_FragColor = vec4(TOTAL, 1.0);
//	gl_FragColor = vec4(0.0,0.0,0.0,0.0);
}
