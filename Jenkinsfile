pipeline {
    agent {
        docker {
            image 'binarysearch/node-chrome-headless-alpine:1.0.1'
        }
    }
    environment {
        CI = 'true'
        DOCKER_USER = 'binarysearch'
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run ng build --prod'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test:app'
            }
        }
        stage('Deliver dev') {
            when {
                expression {
                    return env.BRANCH_NAME == 'develop'
                } 
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-password', variable: 'DOCKER_PASS')]) {
                        sh 'docker login --username=${DOCKER_USER} --password=${DOCKER_PASS}'
                    }
                    sh 'docker build --rm --build-arg app_version_arg=dev -f Dockerfile -t binarysearch/galaxyvictor:dev .'
                    sh 'docker push binarysearch/galaxyvictor:dev'
                    sh 'docker container rm galaxyvictor-dev -f || true'
                    sh 'docker run -d -e API_HOST=https://api-dev.galaxyvictor.com --network=dev_enviroment_default --network-alias=galaxyvictor-dev --name=galaxyvictor-dev binarysearch/galaxyvictor:dev'
                }
            }
        }
        stage('Deliver') {
            when {
                expression {
                    return env.BRANCH_NAME == env.TAG_NAME
                } 
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-password', variable: 'DOCKER_PASS')]) {
                        sh 'docker login --username=${DOCKER_USER} --password=${DOCKER_PASS}'
                    }
                    sh 'docker build --rm --build-arg app_version_arg=${TAG_NAME} -f Dockerfile -t binarysearch/galaxyvictor:${TAG_NAME} .'
                    sh 'docker push binarysearch/galaxyvictor:${TAG_NAME}'
                    sh 'docker container rm galaxyvictor -f || true'
                    sh 'docker run -d -e API_HOST=https://api.galaxyvictor.com --network=dev_enviroment_default --network-alias=galaxyvictor --name=galaxyvictor binarysearch/galaxyvictor:${TAG_NAME}'
                }
            }
        }
        stage('Compodoc') {
            when {
                expression {
                    return env.BRANCH_NAME == env.TAG_NAME
                } 
            }
            steps {
                script {
                    sh 'npm install -g @compodoc/compodoc'
                    sh 'compodoc -p ./tsconfig.app.json -d ./docs/'
                    withCredentials([string(credentialsId: 'docker-password', variable: 'DOCKER_PASS')]) {
                        sh 'docker login --username=${DOCKER_USER} --password=${DOCKER_PASS}'
                    }
                    sh 'docker build --rm -f Dockerfile.docs -t binarysearch/galaxyvictor-compodoc:dev .'
                    sh 'docker push binarysearch/galaxyvictor-compodoc:dev'
                    sh 'docker container rm galaxyvictor-compodoc-dev -f || true'
                    sh 'docker run -d --network=dev_enviroment_default --network-alias=galaxyvictor-compodoc-dev --name=galaxyvictor-compodoc-dev binarysearch/galaxyvictor-compodoc:dev'
                }
            }
        }
        stage('Coverage') {
            when {
                expression {
                    return true || env.BRANCH_NAME == env.TAG_NAME
                } 
            }
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-password', variable: 'DOCKER_PASS')]) {
                        sh 'docker login --username=${DOCKER_USER} --password=${DOCKER_PASS}'
                    }
                    sh 'docker build --rm -f Dockerfile.coverage -t binarysearch/galaxyvictor-coverage-front:dev .'
                    sh 'docker push binarysearch/galaxyvictor-coverage-front:dev'
                    sh 'docker container rm galaxyvictor-coverage-front-dev -f || true'
                    sh 'docker run -d --network=dev_enviroment_default --network-alias=galaxyvictor-coverage-front-dev --name=galaxyvictor-coverage-front-dev binarysearch/galaxyvictor-coverage-front:dev'
                }
            }
        }

    }
}
