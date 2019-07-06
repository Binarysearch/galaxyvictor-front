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
        stage('Build') {
            steps {
                sh 'printenv'
                sh 'cd galaxyvictor && npm install && npm run ng build --prod'
            }
        }
        stage('Test') {
            steps {
                sh 'cd galaxyvictor && npm run test:app'
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
                    sh 'docker build --rm -f Dockerfile -t binarysearch/galaxyvictor:${TAG_NAME} .'
                    sh 'docker push binarysearch/galaxyvictor:${TAG_NAME}'
                    sh 'docker container rm galaxyvictor -f || true'
                    sh 'docker run -d -e API_HOST=https://api.galaxyvictor.com --network=dev_enviroment_default --network-alias=galaxyvictor --name=galaxyvictor binarysearch/galaxyvictor:${TAG_NAME}'
                }
            }
        }
    }
}
