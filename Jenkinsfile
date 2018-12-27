ipipeline {

    parameters {
        string(name: 'KUBE_DEV_NAMESPACE',         description: 'Kubernetes Development Namespace',                  defaultValue: 'playcourt')
        string(name: 'KUBE_PROD_NAMESPACE',        description: 'Kubernetes Production Namespace',                   defaultValue: 'playcourt')
    	string(name: 'KUBE_DEV_URL',               description: 'Kubernetes Development URL',                        defaultValue: 'https://console.playcourt.id')
    	string(name: 'DOCKER_PROD_REGISTRY_URL',   description: 'docker registry',                                   defaultValue: 'docker-registry-default.vsan-apps.playcourt.id')
    	string(name: 'DOCKER_DEV_REGISTRY_URL',    description: 'docker registry',                                   defaultValue: 'docker-registry-default.apps.playcourt.id')
    	string(name: 'SKIP_TLS',                   description: 'Skip TLS',                                          defaultValue: 'true')
    	string(name: 'DOCKER_IMAGE_NAME',          description: 'Docker Image Name',                                 defaultValue: 'api-rest-playcourt')
        string(name: 'DB_TEST_URL',                description: 'DB Test URL',                                       defaultValue: 'mongodb://localhost/db-test')
    }

    environment {
        SECRET_KEY = 'secret'
        DB_TYPE = 'mongo'
        MONGO_URL_TEST  = "${params.DB_TEST_URL}"
    }

    agent any
    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Cleaning Workspace') {
            steps {
                script {
                    echo 'Initializing for clean build...'
                    deleteDir()
                }
            }
        }

        stage('Checkout SCM') {
            agent { label "agent-node-go" }
            steps {
                checkout scm
                script {
                    echo "Checking-out SCM"
                    echo "get COMMIT_ID"
                    sh 'echo -n $(git rev-parse --short HEAD) > ./commit-id'
                    commitId = readFile('./commit-id')    
                }
                stash(name: 'ws', includes:'**,./commit-id')
            }
        }

        stage('Initialize') {
            parallel{
                stage ("Agent: Nodejs"){
                    agent { label "agent-node-go" }
                    steps {
                        script {
                            echo 'Initializing...'
                            echo "Checking-up Environment"
                            sh "git --version"
                            sh "node --version"
                            sh "npm --version"
                        }
                    }
                }
                stage ("Agent: Docker"){
                    agent { label "agent-docker" }
                    steps {
                        script {
                            echo 'Initializing...'
                            echo "Checking-up Environment"
                            sh "git --version"
                            sh "docker --version"
                        }
                    }
                }
            }
        }

        stage('Unit Test') {
            agent { label "agent-node-go" }
            steps {
                unstash 'ws'
                script {
                    echo "Install Dependencies"
                    sh "npm install"
    
                    echo "Run Unit Test"
                    sh "npm test"
                }
            }    
        }

        stage('SonarQube Scan') {
            // when {
            //     anyOf {
            //         branch 'master'
            //         branch 'develop'
            //     }
            // }
            agent { label "agent-node-go" }
            steps {
                unstash 'ws'
                echo "Run SonarQube"
                script {
                    echo "Run SonarQube"
                    echo "defining sonar-scanner"
                    def scannerHome = tool 'SonarQube-Scanner' ;
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        // stage('Build Images Docker') {
        //     parallel {
        //         stage('Build DEV') {
        //             // when {
        //             //     branch 'develop'
        //             // }
        //             agent { label "agent-docker" }
        //             steps {
        //                 unstash 'ws'
        //                 script {
        //                     echo "get COMMIT_ID"
        //                     commitId = readFile('./commit-id')
        //                 }
        //                 sh 'rm -rf ./commit-id'
        //                 sh "docker build --rm -t '${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:dev-${BUILD_NUMBER}-${commitId}' ."       
        //             }
        //         }
        //         stage('Build PROD') {
        //             // when {
        //             //     branch 'master'
        //             // }
        //             agent { label "agent-docker" }
        //             steps {
        //                 unstash 'ws'
        //                 script {
        //                     echo "get COMMIT_ID"
        //                     commitId = readFile('./commit-id')
        //                 }
        //                 sh 'rm -rf ./commit-id'
        //                 sh "docker build --rm -t '${params.KUBE_PROD_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:prod-${BUILD_NUMBER}-${commitId}' ."
        //             }
        //         }
        //         stage('Build Default') {
        //             agent { label "agent-docker" }
        //             steps {
        //                 unstash 'ws'
        //                 script {
        //                     echo "get COMMIT_ID"
        //                     commitId = readFile('./commit-id')
        //                 }
        //                 sh 'rm -rf ./commit-id'
        //                 sh "docker build --rm -t '${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${BUILD_NUMBER}-${commitId}' ."
        //                 sh "docker rmi -f ${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${BUILD_NUMBER}-${commitId}"
        //             }
        //         }
        //     }
        // }
    }
}