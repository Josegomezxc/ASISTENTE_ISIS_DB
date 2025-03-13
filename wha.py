import pyautogui
import time
import os
import speech_recognition as sr
import re
import pyttsx3
import unicodedata

def capturar_voz():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        print("Escuchando... Di el comando para enviar el mensaje.")
        recognizer.adjust_for_ambient_noise(source)  
        audio = recognizer.listen(source)  

    try:
        print("Reconociendo...")
        texto = recognizer.recognize_google(audio, language="es-ES")
        print("Texto reconocido: ", texto)
        return texto
    except sr.UnknownValueError:
        print("No se pudo entender el audio")
        return ""
    except sr.RequestError:
        print("Error de conexión con el servicio de Google")
        return ""

def hablar(texto):
    engine = pyttsx3.init()  # Inicializa el motor de texto a voz
    engine.setProperty('rate', 150)  # Velocidad de la voz
    engine.setProperty('volume', 1)  # Volumen (0.0 a 1.0)
    
    time.sleep(1)  # Añadir un pequeño retraso antes de comenzar a hablar
    engine.say(texto)  # El motor habla el texto
    engine.runAndWait()  # Ejecuta la acción

def normalizar_texto(texto):
    """Normaliza el texto para eliminar caracteres especiales como tildes."""
    # Eliminar tildes y caracteres especiales
    texto_normalizado = unicodedata.normalize('NFD', texto)  # Descompone los caracteres con acento
    texto_normalizado = ''.join([c for c in texto_normalizado if unicodedata.category(c) != 'Mn'])  # Elimina acentos
    return texto_normalizado

def enviar_mensaje(contacto, mensaje, plataforma):
    # Normalizar contacto y mensaje antes de escribir
    contacto = normalizar_texto(contacto)
    mensaje = normalizar_texto(mensaje)

    # Espera diferente dependiendo de la plataforma
    if plataforma == "navegador":
        os.system("start https://web.whatsapp.com/")
        time.sleep(9)  # Espera 12 segundos para WhatsApp navegador
        pyautogui.hotkey("ctrl", "alt", "/")  # Usa Ctrl + Alt + / para buscar en WhatsApp navegador

        pyautogui.write(contacto) 
        time.sleep(2)

        pyautogui.press("enter") 
        time.sleep(2)

        pyautogui.write(mensaje) 
        pyautogui.press("enter") 
    elif plataforma == "escritorio":
        os.system("start whatsapp://")
        time.sleep(5)  # Espera 5 segundos para WhatsApp escritorio
        pyautogui.hotkey("ctrl", "f")  # Usa Ctrl + F para buscar en WhatsApp escritorio
        
        pyautogui.write(contacto) 
        time.sleep(2)

        pyautogui.press("down") 
        pyautogui.press("enter") 
        time.sleep(2)

        pyautogui.write(mensaje) 
        pyautogui.press("enter") 
    

def preguntar_plataforma():
    while True:
        print("¿En qué plataforma estás usando WhatsApp? (navegador o escritorio)")
        hablar("¿En qué plataforma estás usando WhatsApp? Di navegador o escritorio.")
        
        texto = capturar_voz()

        if texto:
            if "navegador" in texto.lower():
                return "navegador"
            elif "escritorio" in texto.lower():
                return "escritorio"
            else:
                print("No entendí la plataforma. Por favor, di 'navegador' o 'escritorio'.")
                hablar("No entendí la plataforma. Por favor, di 'navegador' o 'escritorio'.")
                
        else:
            print("No se reconoció ninguna plataforma. Por favor, di 'navegador' o 'escritorio'.")
            hablar("No se reconoció ninguna plataforma. Por favor, di 'navegador' o 'escritorio'.")
            

def main():
    plataforma = preguntar_plataforma()

    texto = capturar_voz()

    if texto:
        patron = r"envía un mensaje de whatsapp a ([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+) que diga (.+)"
        match = re.match(patron, texto.lower())

        if match:
            contacto = match.group(1).strip()
            mensaje = match.group(2).strip()
            enviar_mensaje(contacto, mensaje, plataforma)
        else:
            print("No pude entender el formato. Usa 'enviar mensaje de WhatsApp a [contacto] que diga [mensaje]'.")
            hablar("No pude entender el formato. Usa 'enviar mensaje de WhatsApp a [contacto] que diga [mensaje]'.")
            
    else:
        print("No se reconoció ningún texto válido.")
        hablar("No se reconoció ningún texto válido.")
        

if __name__ == "__main__":
    main()
