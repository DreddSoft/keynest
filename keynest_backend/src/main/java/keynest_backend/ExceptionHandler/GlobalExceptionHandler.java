package keynest_backend.ExceptionHandler;

import keynest_backend.Exceptions.ErrorGeoDataException;
import keynest_backend.Logs.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

/**
 * Clase que gestiona las excepciones de forma global para todos los controladores del proyecto.
 * Utiliza la anotación @ControllerAdvice para interceptar excepciones no controladas
 * y devolver respuestas adecuadas al cliente.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Manejador de excepciones del tipo IllegalArgumentException.
     * Se devuelve un código de estado 400 (Bad Request) junto con el mensaje de error.
     *
     * @param exception Excepción lanzada de tipo IllegalArgumentException
     * @return ResponseEntity con el tipo de error, el mensaje y el código HTTP correspondiente
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponse> handlerArgumentException(IllegalArgumentException exception) {

        System.out.println(exception.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .type(exception.getClass().toString())
                .message("Error: " + exception.getMessage())
                .build();

        Log.write(000, "ExceptionHandler", response.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

    }

    /**
     * Manejador para excepciones de tipo RuntimeException.
     * Se devuelve un código de estado 502 (Bad Gateway) junto con el mensaje de error.
     *
     * @param exception Excepción lanzada de tipo RuntimeException
     * @return ResponseEntity con el tipo de error, el mensaje y el código HTTP correspondiente
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ExceptionResponse> handlerRuntimeException(RuntimeException exception) {

        System.out.println(exception.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .type(exception.getClass().toString())
                .message("Error: " + exception.getMessage())
                .build();

        Log.write(000, "ExceptionHandler", response.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_GATEWAY);

    }

    /**
     * Manejador para excepciones del tipo personalizadas ErrorGeoDataException
     * Se devuelve un código de estado 400 (Bad Request) junto con el mensaje de error.
     * @param exception - del tipo ErrorGeoDataException
     * @return ResponseEntity con el tipo de error, el mensaje y el código HTTP correspondiente
     */
    @ExceptionHandler(ErrorGeoDataException.class)
    public ResponseEntity<ExceptionResponse> handlerErrorGeoException (ErrorGeoDataException exception) {

        System.out.println(exception.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .type(exception.getClass().toString())
                .message("Error: " + exception.getMessage())
                .build();

        Log.write(000, "ExceptionHandler", response.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

    }

    /**
     * Manejador para excepciones de tipo IOException.
     * Se devuelve un código de estado 400 (Bad Request) junto con el mensaje de error.
     *
     * @param exception Excepción lanzada de tipo IOException
     * @return ResponseEntity con el tipo de error, el mensaje y el código HTTP correspondiente
     */
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ExceptionResponse> handlerIoException (IOException exception) {

        System.out.println(exception.getMessage());

        ExceptionResponse response = ExceptionResponse.builder()
                .type(exception.getClass().toString())
                .message("Error: " + exception.getMessage())
                .build();

        Log.write(000, "ExceptionHandler", response.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

    }

}
