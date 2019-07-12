docker container rm galaxyvictor_api -f || true
docker run -p 8080:8080 --name=galaxyvictor_api binarysearch/galaxyvictor-api:0.0.7