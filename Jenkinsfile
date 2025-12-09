pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mi-react-app'
        CONTAINER_NAME = 'mi-react-container'
        APP_PORT = '80'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositorio...'
                checkout scm
            }
        }

        stage('Build Docker') {
            steps {
                echo '🔨 Construyendo imagen Docker...'
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Stop Container') {
            steps {
                echo '🛑 Deteniendo contenedor anterior...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run Container') {
            steps {
                echo '🚀 Ejecutando nuevo contenedor...'
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:80 \
                        ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment exitoso! App disponible en http://localhost:${APP_PORT}"
        }
        failure {
            echo '❌ Pipeline falló!'
        }
    }
}
