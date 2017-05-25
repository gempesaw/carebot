node {
    stage 'build image'
    checkout scm
    def image = docker.build 'flowbot'

    image.inside {
        stage 'install deps'
        sh 'npm install'

        stage 'execute tests'
        sh 'npm test'
    }
}
