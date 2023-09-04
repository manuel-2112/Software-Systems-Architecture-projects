# IIC2173 - E0 | Fintech Async

Manuel Espinoza Quintero

## Instalación (Ejecución local mediante Docker)

1. Asegúrate de que [Docker](https://docs.docker.com/install/) y [Docker Compose](https://docs.docker.com/compose/install/) estén instalados.

2. Clona este repositorio:

   `git clone https://github.com/iic2173/e0-2023-2-manuel-2112.git`

3. Cambia al directorio del repositorio:

   ```cd e0-2023-2-manuel-2112```

4. Utiliza Docker-Compose para levantar los contenedores:

   `docker-compose up -d --build`

5. Si todo sale bien, debería estar disponible en [stocks](http://localhost:8080/stocks`).

6. Al utilizar FastAPI, la documentación está disponible en [docs](http://localhost:8080/docs).


## Deploy en AWS

1. La API esta en el siguiente dominio [stocktrack.me ](https://stocktrack.me/).

2. La documentación esta disponible en [docs](https://stocktrack.me/docs).

3. Otras rutas con el metodo GET disponibles son:
   - [/stocks](https://stocktrack.me/stocks)
   - [/stocks/{symb}](https://stocktrack.me/stocks/META) (META es un ejemplo)
   - [/events](https://stocktrack.me/events)
   - Además se puede agregar parámetros (```size``` y ```page```) a las rutas anteriores, como por ejemplo: [/stocks?size=100&page=1](https://stocktrack.me/stocks?size=100&page=1)

4. Para el deploy se utilizó AWS EC2, con una instancia t2.micro con Ubuntu 20.04. Donde se instalo Docker, Docker-Compose, Ngnix, Python-pip, Certbot.

5. Para conectarse al servidor debes tener la llave privada, y ejecutar el siguiente comando:

   ```ssh -i "stocksapi_key.pem" ubuntu@ec2-18-191-79-156.us-east-2.compute.amazonaws.com```

## Características

1. La API esta desarrollada en Python con FastAPI.
2. La base de datos es PostgreSQL.
3. Existe un contenedor de Docker para la API, otro para la base de datos, y otro para el MQTT-suscriber.
4. Docker-Compose se utiliza para levantar los contenedores.

## Variables de entorno

1. Deben existir 3 archivos ```.env``` en las carpetas:
   - ```/```: Contiene las variables de entorno para el ```docker-compose.yml```.

      Su contenido sigue la siguiente estructura:
      ```
      DATABASE_URL=postgresql://{USER}:{PASSWORD}@localhost/{DATABASE}
      POSTGRES_USER={USER}
      POSTGRES_PASSWORD={PASSWORD}
      POSTGRES_DB={DATABASE}
      ```

   - ```/src/app```: Contiene solo la ruta a la base de datos para la API. (La estructura es la misma que la anterior.)
   - ```/mqtt-suscriber```: Contiene las variables de entorno para el MQTT-client, dadas en el archivo ```credientials.secret```.

**Importante:** Los datos deben ser consistentes entre los 2 primeros archivos ```.env```.



## Requisitos

| Requisitos funcionales (10p) | Cumplido |
|---|---|
| **RF1: (3p)** | :white_check_mark: |
| **RF3: (5p)** | :white_check_mark: |
| **RF2: (2p)** | :white_check_mark: |

| Requisitos no funcionales (20p) | Cumplido |
|---|---|
| **RNF1: (5p)** | :white_check_mark: |
| **RNF2: (3p)** | :white_check_mark: |
| **RNF3: (2p)** | :white_check_mark: |
| **RNF4: (2p)** | :white_check_mark: |
| **RNF5: (4p)** | :white_check_mark: |
| **RNF6: (4p)** | :white_check_mark: |

| Docker-Compose (15p) | Cumplido |
|---|---|
| **RNF1: (5p)** | :white_check_mark: |
| **RNF2: (5p)** | :white_check_mark: |
| **RNF3: (5p)** | :white_check_mark: |

| Variable | Cumplido |
|---|---|
| **Grupo 1 - HTTPS (25%)** | - |
| **RNF1: (7p)** | :white_check_mark: |
| **RNF2: (3p)** | :white_check_mark: |
| **RNF3: (5p)** | :white_check_mark: |


## Otros

El certificado SSL fue obtenido mediante certbot y el servidor nginx. El archivo de configuración de nginx es el siguiente:

```
server {
    server_name stocktrack.me www.stocktrack.me;
    location / {
        proxy_pass http://127.0.0.1:8080;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/stocktrack.me/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/stocktrack.me/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = www.stocktrack.me) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = stocktrack.me) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name stocktrack.me www.stocktrack.me;
    return 404; # managed by Certbot

}
```

Con cron se actualiza el certificado cada 12 horas, mediante un script ubicado en: ```/opt/certbot-scripts/renovate-cert.sh```.

El script es el siguiente:

```bash
#!/bin/bash

certbot renew --dry-run

if [[ $? -eq 0 ]]; then
    certbot renew
fi
```

Y se ejecuta cada 12 horas mediante el comando ```crontab -e``` y agregando la siguiente linea:

```0 */12 * * * /opt/certbot-scripts/renovate-cert.sh```.