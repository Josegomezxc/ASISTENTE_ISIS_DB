const playBtn = document.getElementById("playBtn");
let isSpeaking = false;  // Controla si ya está hablando

playBtn.addEventListener("click", () => {
    if (isSpeaking) return;  // Evita interrupciones

    isSpeaking = true;  // Bloquea el botón mientras habla
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';  // Cambia a pausa

    const today = new Date();
    const options = { weekday: 'long' };
    const dayOfWeek = today.toLocaleDateString('es-ES', options);

    const frases = [
        `Holi, estás de vuelta. Espero que estés muy, pero muy bien. Comencemos este ${dayOfWeek} con buena energía. Ahorita tengo para ti algunos temas que escuchaste hace poco.`,
        "¡Hola! Me alegra verte de nuevo. Espero que estés teniendo un día increíble. Vamos a empezar esta jornada con buena música. Hoy tengo algunas canciones que te encantarán, ¡prepárate para disfrutar!",
        "¡Hey! Bienvenido de nuevo. Espero que estés listo para relajarte y disfrutar de buena música. Hoy te traigo algunos de tus temas favoritos que seguro te van a hacer sonreír.",
        "¡Hola de nuevo! Espero que estés teniendo un excelente día. ¿Listo para sumergirte en buena música? He preparado una selección de canciones que escuchaste recientemente. ¡Vamos a disfrutar!",
        "¡Saludos! Me alegra que estés aquí. Espero que estés teniendo un día fabuloso. Vamos a animar este momento con música que ya conoces y amas. ¡Espero que estés listo para disfrutar!",
        "¡Hola! Qué alegría tenerte de vuelta. Espero que estés bien. Empecemos esta sesión musical con algunos temas que seguro te harán vibrar. ¡Disfruta la música!",
        "¡Hola, amigo! Me alegra verte otra vez. Espero que estés teniendo un día increíble. Hoy tengo preparado un setlist con tus canciones favoritas. ¡Prepárate para disfrutar!"
    ];

    const frase = frases[Math.floor(Math.random() * frases.length)];

    speakWithAria(frase);

    // Esperar unos segundos antes de volver a cambiar el botón a play
    setTimeout(() => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        isSpeaking = false;  // Permite volver a hablar
    }, frase.length * 100);  // Ajusta el tiempo según la longitud de la frase
});

