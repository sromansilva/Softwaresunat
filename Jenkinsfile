pipeline {
  agent any

  environment {
    EC2_USER = "ubuntu"
    EC2_HOST = "18.118.99.238"
    SSH_CREDENTIALS_ID = "ec2-ssh-key"

    REMOTE_APP_DIR = "~/Softwaresunat"

    CONTAINER_NAME = "mi-react-container"
    IMAGE_NAME = "mi-react-app"

    APP_PORT = "3000"  // Puerto en EC2
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build (validación opcional)') {
      steps {
        echo "🔧 Validando build local en Jenkins..."
        sh 'npm ci || true'
        sh 'npm run build || true'
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent([env.SSH_CREDENTIALS_ID]) {

          sh """
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
              set -e

              echo "📁 Preparando directorio remoto..."
              mkdir -p ${REMOTE_APP_DIR}
              cd ${REMOTE_APP_DIR}

              echo "🔄 Sync del repo remoto..."
              if [ -d .git ]; then
                git fetch --all --prune
                git reset --hard origin/main
              else
                git clone https://github.com/sromansilva/Softwaresunat.git .
              fi

              echo "🐳 Construyendo imagen Docker..."
              sudo docker build -t ${IMAGE_NAME}:latest .

              echo "🧹 Matando contenedor anterior si existe..."
              sudo docker stop ${CONTAINER_NAME} || true
              sudo docker rm ${CONTAINER_NAME} || true

              echo "🚀 Lanzando contenedor nuevo..."
              sudo docker run -d \
                --name ${CONTAINER_NAME} \
                --restart unless-stopped \
                -p ${APP_PORT}:80 \
                ${IMAGE_NAME}:latest

              echo "📦 Estado final del contenedor:"
              sudo docker ps --filter "name=${CONTAINER_NAME}"
            '
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Deploy listo. Visita: http://${EC2_HOST}:${APP_PORT}"
    }
    failure {
      echo "❌ Pipeline falló. Revisa los logs."
    }
  }
}
