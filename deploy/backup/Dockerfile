FROM alpine:3.22

# pg_dump major version must be >= the server version (PostgreSQL 17).
RUN apk add --no-cache postgresql17-client aws-cli openssl tzdata

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

VOLUME /backups
CMD ["/usr/local/bin/backup.sh"]
