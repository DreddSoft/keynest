package keynest_backend.ExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handlerArgumentException(IllegalArgumentException exception) {

        System.out.println(exception.getMessage());
        return new ResponseEntity<String>("Error: " + exception.getMessage(), HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handlerRuntimeException(RuntimeException exception) {

        System.out.println(exception.getMessage());
        return new ResponseEntity<String>("Error:" + exception.getMessage(), HttpStatus.BAD_GATEWAY);

    }

}
