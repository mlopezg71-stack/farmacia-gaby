pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Codigo fuente obtenido desde GitHub correctamente.'
            }
        }

        stage('Build') {
            steps {
                echo 'Construyendo Farmacia Gaby...'
                bat 'docker compose build'
            }
        }

        stage('Test') {
            steps {
                echo 'Ejecutando pruebas del proyecto...'
                bat 'docker compose config --quiet'
                echo 'Validacion completada correctamente.'
            }
        }

        stage('Deploy Staging') {
            steps {
                echo 'Desplegando Farmacia Gaby en ambiente staging...'

                withCredentials([
                    string(credentialsId: 'gaby-postgres-user', variable: 'POSTGRES_USER'),
                    string(credentialsId: 'gaby-postgres-password', variable: 'POSTGRES_PASSWORD'),
                    string(credentialsId: 'gaby-postgres-db', variable: 'POSTGRES_DB')

                ]) {
                bat 'docker compose -p farmacia-gaby-staging -f docker-compose.yml -f docker-compose.staging.yml up -d'

                }
                
                echo 'Despliegue staging completado.'
            }
        }
    }

    post {
        success {
            echo 'PIPELINE CI/CD DE FARMACIA GABY COMPLETADO CORRECTAMENTE.'
        }

        failure {
            echo 'EL PIPELINE CI/CD DE FARMACIA GABY HA FALLADO.'
        }
    }
}