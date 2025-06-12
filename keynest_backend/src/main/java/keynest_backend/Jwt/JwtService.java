package keynest_backend.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import keynest_backend.Utils.Env;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    // Atributos
    private static final String SECRET_KEY = Env.get("JWT_SECRET");
    private final int EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 HORAS

    public String getToken(UserDetails user) {

        return getToken(new HashMap<>(), user);
    }

    private String getToken(Map<String, Object> extraClaims, UserDetails user) {

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getKey() {

        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getEmailFromToken(String token) {


        return getClaim(token, Claims::getSubject);


    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String email = getEmailFromToken(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Claims getAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {

        final Claims claims = getAllClaims(token);

        return claimsResolver.apply(claims);

    }

    private Date getExpirationDate(String token) {


        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {

        return getExpirationDate(token).before(new Date());
    }
}
