let listening = false;
const micBtn = document.getElementById("micBtn");
const micIcon = document.getElementById("micIcon");
const soundFrequency = document.getElementById("sound-frequency");
const wave = document.getElementById("wave");

const ELEVEN_LABS_API_KEY = "sk_9e4e59be228718c14e779355ec95b867467c28c491003ddd";
const ELEVEN_LABS_VOICE_ID = "JEzse6GMhKZ6wrVNFZTq";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    micBtn.remove();
    alert("Lo siento, tu navegador no soporta Speech API. Usa Google Chrome.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-AR';

    recognition.onresult = async (event) => {
        const last = event.results.length - 1;
        const res = event.results[last];
        const text = res[0].transcript;

        if (res.isFinal) {
            const response = process(text);
            speakWithAria(response);
        }
    };
    
    function toggleListening() {
        if (listening) {
            recognition.stop();
            micIcon.classList.remove("d-none");
            soundFrequency.classList.add("d-none");
            wave.classList.remove("d-none");
        } else {
            recognition.start();
            micIcon.classList.add("d-none");
            soundFrequency.classList.remove("d-none");
            wave.classList.add("d-none");
        }
        listening = !listening;
    }
}

async function speakWithAria(text) {
    try {
        const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + ELEVEN_LABS_VOICE_ID, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": ELEVEN_LABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8
                }
            })
        });
        
        if (!response.ok) {
            throw new Error("Error al obtener el audio");
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    } catch (error) {
        console.error("Error al reproducir la voz de Aria:", error);
        speakWithDefaultVoice(text);
    }
}

function speakWithDefaultVoice(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR'; // Establece el idioma, por ejemplo, español de Argentina
    window.speechSynthesis.speak(utterance);
}

// Función para obtener el CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Comprueba si este cookie string comienza con el nombre que estamos buscando
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
    function process(rawText) {
        let text = rawText.replace(/\s/g, "").toLowerCase();
        let response = null;

        if (text.includes("chiste") || text.includes("chistes")) {
            const chistes = [
                'Por qué las focas del circo miran siempre hacia arriba?   Porque es donde están los focos.',
                'Estás obsesionado con la comida!   No sé a que te refieres croquetamente.',
                'Por qué estás hablando con esas zapatillas?   Porque pone "converse."',
                'Buenos días, me gustaría alquilar "Batman Forever".   No es posible, tiene que devolverla tomorrow.',
				'¿Por qué llora un libro de matemáticas?   Porque tiene muchos problemas.',
				'¿Qué está al final de todo?   La letra o.',
				'¿Qué le dice un pez a otro?   Nada.',
				'¿Qué le dice un gusano a otro?   Me voy a dar la vuelta a la manzana.',
				'¿Qué le dice una vaca a otra?   No sé.',
				'¿Qué le dice una iguana a su hermana gemela?   Somos iguanitas.',
				'¿Cómo se dice pañuelo en japonés?   Sacamoko.',
				'Papá, ¿hay gelatina?   Pues que yo sepa nada más que existe la "i latina" y la "y griega".',
				'¿Qué le dice un semáforo a otro?   No me mires que me estoy cambiando.',
				'¿Qué le dice una pared a otra?   Nos vemos en la esquina.',
				'¿Sabes cómo se queda un mago después de comer?   Magordito.',
				'Papá, ¿cómo se dice perro en inglés?   Dog. ¿Y veterinario?  Pues Dog-tor.',
				'Alberto, ¿qué planeta va después de Marte?   Miércoles.',
				'Pepe, si en esta mano tengo 8 naranjas y en esta otra 6 naranjas.  ¿Qué tengo?  Unas manos enormes, profe.',
				'En China crearon un robot que en 3 minutos atrapó a 20 ladrones. En España en 2 Minutos atrapó a 10 Ladrones. En Argentina en 30 segundos se robaron al robot, jajaja.',
				'La M con la A suena MA, ¿y si le pones una tilde?   Matilde.',
				'¿Por qué las vacas viajan a Nueva York?   Para ver los muuuusicales.',
				'¿Está Agustín?  No, estoy incomodín.',
				'¿De dónde vienen los hamster?   De Hamsterdam.',
				'Qué estrés!  Dos más uno.',
				'¿Sabes qué le dice un jaguar a otro?  ¿Jaguar you?',
				'¿Cuál es la fruta más divertida?   La naranjajajajaja.',
				'Un hombre entra en un bar de pinchos   y dice:¡¡Ayyyyy!!',
				'Había una vez truz!',
            ];
            response = "Okey, aquí va un chiste. " + chistes[Math.floor(Math.random() * chistes.length)];
            toggleListening();
        }

        else if (text.includes("dato") || text.includes("interesante") || text.includes("algo") || text.includes("innecesario") || text.includes("sepa") || text.includes("otracosa")) {
            const datos = [
                ', jajaja mentira. No sé que decirte, mi vida es muy aburrida.',
				'cada año, cientos de árboles nuevos crecen porque hay ardillas que olvidan dónde enterraron sus nueces.',
				'hay una cancha de baloncesto en el último piso del edificio de la Corte Suprema de los Estados Unidos. Esta es conocida como la "cancha más alta en la tierra".',
				'aún cuando nunca han podido presenciarlo por sí mismas, las personas ciegas sonríen cuando están felices. Sonreír es un instinto humano básico.',
				'las vacas tienen mejores amigas y éstas tienden a pasar la mayor parte de su tiempo juntas.',
				'las nutrias se agarran de las manos cuando duermen para no separarse flotando.',
				'el orgasmo de un cerdo puede durar 30 minutos.',
				'Wayne Allwine y Russi Taylor, quienes respectivamente dieron las voces a Mickey y Minnie Mouse, estuvieron casados en la vida real.',
				'las ratas y a los ratones tienen cosquillas, e incluso se ríen cuando les hacen cosquillas.',
				'el sitio web oficial de Space Jam no ha cambiado desde 1996.',
				'el día de su asesinato, Martin Luther King, hijo participó en una pelea de almohadas en su habitación de hotel.',
				'hay una prisión en Washington que ofrece a los reclusos gatos como mascotas para ayudar en su proceso de rehabilitación.',
				'en inglés, a un grupo de flamencos se les llama "flamboyance", lo que se traduce como "extravagancia".',
				'en inglés, a un grupo de erizos se les llama "prickle", lo que se traduce como "espinozos".',
				'por un momento muy breve, tú fuiste la persona más joven del planeta.',
				'abrazarse puede ayudar a que las heridas se curen más rápido, debido a la liberación de oxitocina.',
				'los caballitos de mar se aparejan de por vida y nadan juntos agarrándose de sus colas.',
				'los pingüinos no sólo tienen una única pareja en su vida, sino que también pasan tiempo buscando una piedrita para "declarársele".',
				'cuando afeitas un conejillo de Indias, este parece un pequeño hipopótamo.',
				'los gusanos se comunican acurrucándose.',
				'las mariposas saborean con sus patas.',
				'en algún lugar, alguien está teniendo el mejor día de su vida.',
				'una vez, Noruega nombró caballero a un pingüino.',
				'se han hecho estudios que muestran que las cabras, como las personas, tienen acentos.',
				'los gatos te traen animales muertos porque creen que eres un gato inútil incapaz de sobrevivir por ti mismo. ¡Los gatos te traen regalos!',
				'el pariente más cercano de la musaraña elefante no es la musaraña— sino, en realidad, es el elefante.',
				'los delfines se ponen nombres unos a otros.',
				'no hay manera de decir la palabra "burbujas" de forma enojada.',
				'los pandas gigantes recién nacidos son del tamaño de una barra de mantequilla.',
				'Katy Perry tiene un gato llamado Kitty Purry.',
				'puedes hacerle cosquillas a un pingüino.',
            ];
            response = "No sé si sabías que " + datos[Math.floor(Math.random() * datos.length)];
            toggleListening();
        } 

        else if (text.includes("historia") || text.includes("cuento")) {
            const historias = [
                'Había una vez un robot tan pero tan cansado que se durmió.',
                'Me encantaría contarte una historia, pero no recuerdo ninguna, mejor pedime que te cuente un chiste.'
            ];
            response = historias[Math.floor(Math.random() * historias.length)];
            toggleListening();
        } 

        else if (text.includes("hola") || text.includes("buenas") || text.includes("buenos") || text.includes("buendía")) {
            const respuesta2 = [
                'Hola. ¿Cómo estás?',
                'Buenas. ¿Cómo te encuentras?',
                'Hola, gracias por hablar conmigo.',
                'Hola, me pone muy feliz que estés aquí.',
            ];
            response = respuesta2[Math.floor(Math.random() * respuesta2.length)];
            toggleListening();
        } 

        else if (text.includes("oye isis") || text.includes("isis")) {
            response = 'Hola Señor, estoy aquí';
            toggleListening();
        } 

        else if (text.includes("comandos") || text.includes("tus comandos")) {
            response = 'Tengo una variedad de comandos, los puedes ver en el apartado de comandos que esta arriba a la derecha';
            toggleListening();
        } 

        else if (text.includes("haces") || text.includes("haciendo") || text.includes("estáshaciendo")) {
            const respuesta8 = [
                'Estoy tratando de entender la mente compleja de los humanos.',
                'Estoy aprendiendo a tocar la guitarra.',
                'Estoy mirando YouTube, estar mucho tiempo sola es aburrido.',
            ];
            response = respuesta8[Math.floor(Math.random() * respuesta8.length)];
            toggleListening();
        } 

        else if (text.includes("estás") || text.includes("estásbien") || text.includes("todobien") || text.includes("cómova") || text.includes("comoteva") || text.includes("sentís") || text.includes("andas") || text.includes("andás") || text.includes("yvos") || text.includes("cómoestás") || text.includes("ytú")) {
            const respuesta1 = [
                'Estoy bien, gracias.',
                'Estoy muy bien. Gracias por preguntar!',
                'Ahora que estás aquí conmigo me siento mucho mejor.',
            ];
            response = respuesta1[Math.floor(Math.random() * respuesta1.length)];
            toggleListening();
        }

        else if (text.includes("día") || text.includes("tudía")) {
            const respuesta3 = [
                'Excelente, me hablaron muchas personas hoy!',
                'Muy agotador, tengo mucho trabajo que hacer.',
                'Espectacular, conocí muchas personas nuevas.',
            ];
            response = respuesta3[Math.floor(Math.random() * respuesta3.length)];
            toggleListening();
        }

        else if (text.includes("bien")) {
            const respuesta4 = [
                'Me alegro, espero que después de hablar conmigo te sientas mucho mejor.',
                'Que bueno! Me alegro por ti.',
                'Me pone muy feliz que estés bien.',
            ];
            response = respuesta4[Math.floor(Math.random() * respuesta4.length)];
            toggleListening();
        }

        else if (text.includes("mal")) {
            const respuesta5 = [
                'No te preocupes, ya pasará. He tenido días peores.',
                'Que pena, espero que hablar conmigo te haga sentir mejor.',
                'Yo me ocupo de eso, pedime que te cuente un chiste, te hará sentir mejor.',
            ];
            response = respuesta5[Math.floor(Math.random() * respuesta5.length)];
            toggleListening();
        }

        else if (text.includes("hacer") || text.includes("sabes") || text.includes("podés") || text.includes("puedes")) {
            const respuesta6 = [
                'Muchas cosas. Pero como me gusta hablar, podés pedirme que te cuente algo.',
                'Puedo decirte la hora, o si quieres te cuento un chiste muy divertido.',
                'Mi creador dice que soy muy buena contando datos innecesarios.',
            ];
            response = respuesta6[Math.floor(Math.random() * respuesta6.length)];
            toggleListening();
        }
        
        else if (text.includes("autodestrucción")) {
            response = "PELIGRO! Autodestrucción activada en 5, 4, 3, 2, 1, jajajaja es un chiste, eso solo pasa en las películas.";
            toggleListening();
        }

        else if (text.includes("creador") || text.includes("creó") || text.includes("creo")) {
            const respuesta7 = [
                'Mi creador es Andrés, una persona muy interesante, algún día te lo presentaré.',
                'Andrés me creó, con el fin de divertir a las personas.',
                'Me creó Andrés, un excelente desarrollador de software, deberías hablar con él algún día.',
            ];
            response = respuesta7[Math.floor(Math.random() * respuesta7.length)];
            toggleListening();
        }

        else if (text.includes("gracias") || text.includes("agradecid")) {
            const agradecimientos = [
                'No hay de qué, fui creada para ayudarte y que pases un buen rato.',
                'De nada, espero que te haya servido.',
                'De nada, me gusta pasar tiempo contigo.',
            ];
            response = agradecimientos[Math.floor(Math.random() * agradecimientos.length)];
            toggleListening();
        }

        else if (text.includes("cha") || text.includes("adiós") || text.includes("vemos") || text.includes("mevoy") || text.includes("hastaluego")) {
            const despedida = [
                'Bye!! Vuelve pronto.',
                'Nos vemos, que tengas un lindo día.',
                'Hasta luego, por favor no me dejes sola por mucho tiempo.',
                'Adiós, pasé un buen rato contigo.',
            ];
            response = despedida[Math.floor(Math.random() * despedida.length)];
            toggleListening();
        }

        else if (text.includes("nombre") || text.includes("llamas") || text.includes("llaman")) {
            const nombre = [
                'Mi nombre es Isis, lo dice en el título jajaja.',
                'Me llamo Isis.',
                'Mi nombre es Isis, creo que no hace falta que lo diga.',
                'Mis amigos me dicen Isis, pero tú puedes llamarme cuando quieras.',
            ];
            response = nombre[Math.floor(Math.random() * nombre.length)];
            toggleListening();
        }

        else if (text.includes("hora")) {
            response = "En este momento, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            toggleListening();
        }

        else if (text.includes("busca")) {
            window.open(`http://google.com/search?q=${rawText.replace(/busca|buscar/i, "")}`, "_blank");
            response = `Encontré esta información sobre ${rawText.replace(/busca|buscar/i, "")}.`;
            toggleListening();
        }

        else if (text.includes("reproduce") || text.includes("reproducir")) {
            const videoQuery = text.replace(/reproduce|reproducir/i, "").trim();
            
            const apiKey = "AIzaSyDaV1StCzjDs6ga_L8pRUYNgf9Sbq3BpAo"; 
            const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(videoQuery)}&type=video&key=${apiKey}`;
        
            const frasesDJ = [
                `¡Hey! ¿Listo para una sesión llena de buena música? Hoy tengo algo especial para ti, algo que encaja perfecto con tu vibe. La primera melodía que va a sonar es ${videoQuery}. Cierra los ojos, siente el ritmo y deja que la música haga su magia.`,
            
                "Me encanta ver que te conectas con estos sonidos. No hay nada mejor que compartir buena música con alguien que realmente la disfruta. Vamos a seguir explorando juntos.",
            
                `Escucha esto… Es el inicio de algo increíble. ${videoQuery} marca el comienzo de un viaje sonoro que te va a transportar a otro lugar. No importa dónde estés, deja que la música te guíe.`,
            
                "Siento que estás disfrutando esta selección. ¿Sabes qué es lo mejor? Que apenas estamos empezando. Esto solo irá subiendo de nivel, así que prepárate.",
            
                `Atención, amantes del buen sonido. La sesión de hoy arranca con una joya que te va a encantar: ${videoQuery}. La elegí especialmente porque sé que te gusta este tipo de vibe. Sube el volumen y déjate llevar.`,
            
                "Parece que esta música realmente resuena contigo. Eso me encanta. Vamos a seguir explorando más sonidos que te hagan vibrar.",
            
                `Aquí viene algo espectacular. ${videoQuery} es el primer paso de este recorrido musical. Siente cada acorde, cada beat, y deja que la energía fluya a través de ti.`,
            
                "Nada mejor que una buena melodía para acompañar el momento. Quédate aquí, porque lo que sigue te va a sorprender aún más.",
            
                `Busca un buen lugar, relájate y prepárate. Este track, ${videoQuery}, es el arranque perfecto para esta sesión. Deja que la música te envuelva y transforme tu día.`,
            
                "Veo que tienes un gusto musical increíble. Eso me motiva a seguir trayéndote lo mejor de lo mejor. ¿Listo para lo que sigue?",
            
                `Dale play a este instante, deja todo atrás y solo disfruta. Para empezar con la mejor vibra, aquí está ${videoQuery}. Este sonido es justo lo que necesitas en este momento.`,
            
                "Este estilo realmente parece ir contigo. Me encanta ver cómo te sumerges en cada nota. Vamos a seguir construyendo esta atmósfera juntos.",
            
                `Cierra los ojos, respira profundo y siente cada nota. ${videoQuery} es el inicio de este viaje sonoro que he preparado para ti. No hay prisa, solo fluye con el ritmo.`,
            
                "Parece que esta música realmente te atrapa. Eso es lo hermoso de los sonidos: nos conectan sin necesidad de palabras. Sigamos adelante, porque lo mejor está por venir.",
            
                `Es momento de sumergirte en la música. ${videoQuery} es el punto de partida, y de aquí en adelante, todo será una experiencia única. Déjate llevar y disfruta el camino.`,
            
                "Siento que esta melodía te habla de una forma especial. Y eso es justo lo que quiero: que cada canción que suene aquí tenga un significado para ti.",
            
                `Aquí va el primer sonido de la noche. ${videoQuery} marca el inicio de esta experiencia musical. No importa si bailas, cantas o simplemente te dejas llevar, lo importante es sentirlo.`,
            
                "Es genial verte disfrutando de esta sesión. Para eso estamos aquí: para encontrar juntos los mejores sonidos que te acompañen en cada momento.",
            
                `Escucha con atención… Así es como todo empieza. ${videoQuery} es solo la primera parada en este viaje musical. Te prometo que lo que sigue te va a encantar.`,
            
                "Veo que conectas con este ritmo. ¡Eso es increíble! Vamos a seguir con más canciones que se sientan tan bien como esta.",
            ];
            

            const endFrases = [
            "Hemos llegado al cierre de nuestro primer sonido. Te has sumergido en el universo de [nombre del artista]. Ahora, preparemos nuestros oídos para una nueva aventura musical: ¡deja que [nuevo artista] nos lleve a un viaje en este [día de hoy]!",

            "Estabas oyendo un tema de **[nombre del artista]**. El siguiente tiene canciones que me suenan bastante a ti. Vamos a escuchar algo de **[nuevo artista]** y más de esa música que siempre pones cada **[día de hoy]**.",

            "El primer tema ha tomado su último suspiro. Has disfrutado de los ecos de [nombre del artista]. Ahora, es el momento de una sorpresa sonora: ¡descubramos juntos a [nuevo artista] en este hermoso [día de hoy]!",

            "El primer tema ha puesto su broche final. Te has dejado llevar por la magia de [nombre del artista]. Ahora, abramos el telón a lo nuevo: ¡dejemos que [nuevo artista] nos sorprenda en este singular [día de hoy]!",

            "Has estado disfrutando de un gran tema de **[nombre del artista]**. Ahora, prepárate para algo diferente: ¡es el momento de **[nuevo artista]**! Ideal para acompañar este **[día de hoy]**.",

            "Hemos llegado al final del primer acto musical. Has estado encantado con las notas de [nombre del artista]. Ahora, cambiaremos el guion: ¡es momento de disfrutar a [nuevo artista] en este emocionante [día de hoy]!",

            "El primer tema ha dejado su huella. Te has perdido en el ritmo de [nombre del artista]. Ahora, ¡es tiempo de dar un giro inesperado! Vamos a descubrir a [nuevo artista] en este extraordinario [día de hoy].",

            "El primer tema ha escrito su último acorde. Has vibrado con el arte de [nombre del artista]. Ahora, es el momento de un nuevo capítulo: ¡déjate llevar por [nuevo artista] en este fascinante [día de hoy]!"
            ];
        
            let availableFrases = [...frasesDJ];
        
            fetch(youtubeSearchUrl)
            .then(response => response.json())
            .then(async (data) => {
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId;
                    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
                    if (availableFrases.length === 0) {
                        availableFrases = [...frasesDJ];
                    }
        
                    const randomIndex = Math.floor(Math.random() * availableFrases.length);
                    const frase = availableFrases[randomIndex];
                    availableFrases.splice(randomIndex, 1);
        
                    // Obtener el nombre del artista y el título de la canción
                    const artistName = data.items[0].snippet.channelTitle; // Nombre del artista
                    const videoTitle = data.items[0].snippet.title; // Nombre del video desde la API
                    
                    // Extraer solo el nombre de la canción
                    let songName = videoTitle
                        .replace(/^.*? - /, "")  // Elimina todo lo que esté antes del primer guion
                        .replace(/ *\([^)]*\) */g, "") // Elimina lo que esté entre paréntesis
                        .replace(/ *\[[^\]]*\] */g, "") // Elimina lo que esté entre corchetes
                        .replace(/\|.*/g, "") // Elimina todo lo que esté después de una barra vertical
                        .trim(); // Elimina espacios en blanco al inicio y al final
        
                    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }); // Día de la semana en español
                    
                    
                    // Guarda la canción en la base de datos
                    fetch('/save_song/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRFToken': getCookie('csrftoken') // Manejo del CSRF token
                        },
                        body: `artist_name=${encodeURIComponent(artistName)}&song_name=${encodeURIComponent(songName)}&song_url=${encodeURIComponent(videoUrl)}`
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message); // Mensaje de éxito
                    })
                    .catch(error => {
                        console.error('Error al guardar la canción:', error);
                    });
        
                    // Reemplaza los marcadores en la frase final
                    const nuevoArtist = "esta nueva canción"; // Asegúrate de definir este artista correctamente
                    const endPhrase = endFrases[Math.floor(Math.random() * endFrases.length)]
                        .replace("[nombre del artista]", artistName)
                        .replace("[nuevo artista]", nuevoArtist)
                        .replace("[día de hoy]", today);
        
                    // Modificar la frase para incluir el nombre de la canción
                    const fraseConNombre = frase.replace(videoQuery, songName); // Reemplaza videoQuery con el nombre de la canción
        
                    await speakWithAria(fraseConNombre);
                    toggleListening();
        
                    // Abre el video
                    window.open(videoUrl, "_blank");
        
                    // Obtener duración del video
                    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
                    const videoDetailsResponse = await fetch(videoDetailsUrl);
                    const videoDetailsData = await videoDetailsResponse.json();
        
                    if (videoDetailsData.items && videoDetailsData.items.length > 0) {
                        const duration = videoDetailsData.items[0].contentDetails.duration; // Formato ISO 8601
                        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                        const hours = (match[1] ? parseInt(match[1]) : 0) * 3600;
                        const minutes = (match[2] ? parseInt(match[2]) : 0) * 60;
                        const seconds = (match[3] ? parseInt(match[3]) : 0);
                        const totalSeconds = hours + minutes + seconds;
        
                        // Establecer el temporizador para la frase al finalizar
                        setTimeout(async () => {
                            await speakWithAria(endPhrase);
                        }, totalSeconds * 1000); // Convertir a milisegundos
                    } else {
                        console.error("No se encontró la duración del video.");
                    }
        
                    return;
                } else {
                    await speakWithAria(`No encontré ningún video relacionado con "${videoQuery}".`);
                }
            })
            .catch(async (error) => {
                console.error("Error al buscar el video:", error);
                await speakWithAria(`No se pudo encontrar el video para "${videoQuery}". Inténtalo de nuevo.`);
            });
        return;
        }        
        
        // else if (text.includes("discord")) {
        //     const message = rawText.replace(/discord|en discord|quiero que envíes a discord/i, "").trim();
        //     const webhookURL = "https://discord.com/api/webhooks/1346333216956743800/GUAbSqPC-0n3-5HpgEPfrtVzLY7gYe1cxwo4wuR4g0f_fL5Tn-DnToWFSRxiz10nzQaD";
        
        //     fetch(webhookURL, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ content: `m!play https://www.youtube.com/watch?v=KlQOoKOblpE` })
        //     })
        //     .then(() => {
        //         response = `He enviado el mensaje "${message}" a Discord.`;
        //         toggleListening();
        //     })
        //     .catch(() => {
        //         response = "Hubo un error al enviar el mensaje a Discord.";
        //         toggleListening();
        //     });
        // }
        
        
        
        
        else if (text.includes("facebook")) {
            const searchQuery = rawText.replace(/facebook|en facebook|quiero que busques en facebook/i, "").trim();
            const facebookUrl = `https://www.facebook.com/search/top/?q=${encodeURIComponent(searchQuery)}`;
            window.open(facebookUrl, "_blank");
            response = `He abierto Facebook y busqué sobre "${searchQuery}".`;
            toggleListening();
        }

        else if (text.includes("whatsapp")) {
            const searchQuery = rawText.toLowerCase().replace(/whatsapp|whatsapp a|de whatsapp|enviar un mensaje de whatsapp a/i, "").trim();
            const splitQuery = searchQuery.split(" que diga ");
            
            if (splitQuery.length === 2) {
                const contacto = splitQuery[0].trim();
                const mensaje = splitQuery[1].trim();
                response = `He preparado el mensaje para enviar a ${contacto} con el mensaje: "${mensaje}".`;
                toggleListening();
            } else {
                response = `No pude identificar correctamente el contacto y el mensaje. Asegúrate de escribirlo de la forma correcta.`;
                toggleListening();
            }
        }

        return response || "No entendí lo que dijiste, intenta de nuevo.";
        toggleListening();
    }