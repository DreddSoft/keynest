package keynest_backend.Utils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;

public class Log {

    // Sacamos el archivo
    private static final String LOG_DIR = "./logs";
    private static final String LOG_FILE = LOG_DIR + "/general-log.txt";

    /**
     * Método para escribir mensajes en el archivo Log principal
     *
     * @param userId - el id del usuario que actua
     * @param modul - el modulo sobre el que trabaja
     * @param message - el mensaje
     */
    public static void write(int userId, String modul, String message) {

        try {
            // Crear el directorio si no existe
            File dir = new File(LOG_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Fecha actual
            String dateTime = LocalDateTime.now().toString();

            // Escribir en el archivo
            BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE, true));
            writer.write("[" + dateTime + "] User Id: " + userId + " | Modulo: " + modul + " | Mensaje: " + message);
            writer.newLine();
            writer.close();

        } catch (IOException e) {
            System.err.println("Error al escribir en el log: " + e.getMessage());
        }

    }

}
