import pyautogui
import pygetwindow as gw
import time

# Buscar ventanas que contengan "YouTube"
for window in gw.getWindowsWithTitle('YouTube'):
    window.activate()  # Activar la ventana que tiene YouTube
    time.sleep(1)  # Esperar un momento para que se active
    pyautogui.hotkey('ctrl', 'w')  # Cerrar la pestaña activa

