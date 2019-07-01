pipeline {
    agent {
        docker {
            image 'binarysearch/node-chrome-headless-alpine:1.0.1'
        }
    }
    environment {
        CI = 'true'
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
                    sh 'docker build --rm -f Dockerfile -t galaxyvictor .'
                    sh 'docker container rm galaxyvictor -f || true'
                    sh 'docker run -d --network=dev_enviroment_default --network-alias=galaxyvictor --name=galaxyvictor galaxyvictor'
                }
            }
        }
    }
}
