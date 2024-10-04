pipeline { 
    agent any 
    options {
        skipStagesAfterUnstable()
    }

    environment { 
        apacheHausFolderQa = "C:/Apache24/htdocs"
        apacheHausFolderDev = "C:/Apache24dev/htdocs"
        apacheHausFolderProd = "Z:\\Apache24\\htdocs"
    }
 

    stages {
        stage('Build'){
            steps {
                script {
                    echo "BUILD"
                    bitbucketStatusNotify(buildState: 'INPROGRESS')
                    try {
                      bat "del /S docker-compose.yml"
                      bat "del /S Jenkinsfile"
                      bat "del /S README.md"
                    } catch (Exception e) {
                      bitbucketStatusNotify(buildState: 'FAILED')
                    }
                    bitbucketStatusNotify(buildState: 'SUCCESSFUL')
                }
             }
        }

        // stage('Update version DEV') {
        //     when {
        //         branch 'feature/*'
        //     }
        //     steps {
        //         echo "UPDATE VERSION"
        //         updatePort("8081")
        //         updateVersionProject("${BUILD_NUMBER}")
        //     }
        // }

        // stage('Clear Apache Haus DEV') {
        //     when {
        //         branch 'feature/*'
        //     }
        //     steps {
        //         echo "CLEAR APACHE HAUS FOLDER DEV: ${apacheHausFolderDev}"
        //         bat "RD /S /Q \"${apacheHausFolderDev}\""
        //         bat "mkdir \"${apacheHausFolderDev}\""
        //     }
        // }
        
        // stage('Deploy DEV') {
        //     when {
        //         branch 'feature/*'
        //     }
        //     steps {
        //         echo "DEPLOY DEV"
        //         echo "${env.WORKSPACE}"
        //         bat "xcopy \"${env.WORKSPACE}\" \"${apacheHausFolderDev}\" /s /e /y /i"
        //     }
        // }

        stage('Update version QA') {
            when {
                branch 'master'
            }
            steps {
                echo "UPDATE VERSION"
                updatePort("8080")
                updateVersionProject("${BUILD_NUMBER}")
            }
        }

        stage('Clear Apache Haus QA') {
            when {
                branch 'master'
            }
            steps { 
                echo "CLEAR APACHE HAUS FOLDER QA: ${apacheHausFolderQa}"
                bat "RD /S /Q \"${apacheHausFolderQa}\""
                bat "mkdir \"${apacheHausFolderQa}\""
            }
        }
        
        stage('Deploy QA') {
            when {
                branch 'master'
            }
            steps {
                echo "DEPLOY QA"
                echo "${env.WORKSPACE}"
                bat "xcopy \"${env.WORKSPACE}\" \"${apacheHausFolderQa}\" /s /e /y /i"
            }
        }


        stage('Update version PROD') {
            when {
                branch 'release/*'
            }
            steps {
                echo "UPDATE VERSION"
                updatePort("8080")
                updateVersionProject("${BUILD_NUMBER}")
            }
        }

        stage('Clear Apache Haus PROD') {
            when {
                branch 'release/*'
            }
            steps { 
                echo "CLEAR APACHE HAUS FOLDER PROD: ${apacheHausFolderProd}"
                bat "RD /S /Q \"${apacheHausFolderProd}\""
                bat "mkdir \"${apacheHausFolderProd}\""
            }
        }
        
        stage('Deploy PROD') {
            when {
                branch 'release/*'
            }
            steps {
                echo "DEPLOY PROD"
                echo "${env.WORKSPACE}"
                bat "xcopy \"${env.WORKSPACE}\" \"${apacheHausFolderProd}\" /s /e /y /i"
            }
        }


    }

    post { 
        always { 
            cleanWs()
        }
    }
}

@NonCPS
def updateVersionProject(BUILD_NUMBER) {
    def currentDir = new File(".");

    // def backupFile;
    def fileText;

    //Replace the contents of the list below with the
    //extensions to search for
    def exts = [".html"]

    //Replace the value of srcExp to a String or regular expression
    //to search for.
    def srcExp = "#version#"

    //Replace the value of replaceText with the value new value to
    //replace srcExp
    def replaceText = "v.${BUILD_NUMBER}"

    currentDir.eachFileRecurse({ file ->
        for (ext in exts){
            if (file.name.endsWith(ext)) {
                fileText = file.text;
                // backupFile = new File(file.path + ".bak");
                // backupFile.write(fileText);
                fileText = fileText.replaceAll(srcExp, replaceText)
                file.write(fileText);
            }
        }
    })
}

@NonCPS
def updatePort(port) {
    def currentDir = new File(".");

    // def backupFile;
    def fileText;

    //Replace the contents of the list below with the
    //extensions to search for
    def exts = [".js"]

    //Replace the value of srcExp to a String or regular expression
    //to search for.
    def srcExp = ":8080"

    //Replace the value of replaceText with the value new value to
    //replace srcExp
    def replaceText = ":" + port

    currentDir.eachFileRecurse({ file ->
        if (file.name == 'app.js') {
                fileText = file.text;
                // backupFile = new File(file.path + ".bak");
                // backupFile.write(fileText);
                fileText = fileText.replaceAll(srcExp, replaceText)
                file.write(fileText);
            }
    })
}