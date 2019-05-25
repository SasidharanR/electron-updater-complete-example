const {autoUpdater} =require('electron-updater')
const log = require('electron-log');
const ProgressBar = require('electron-progressbar');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
const eDialog = require('electron-dialogbox');
autoUpdater.autoDownload = false;
exports.check = () => {

    autoUpdater.checkForUpdates()
    autoUpdater.on('update-available',()=> {
        let downloadProgress;
        let progressBar;
        updatePopup();
        async function updatePopup() {
  
            let result = await eDialog.showDialog(
                  'file:///'+__dirname+'/updatePopup.html', {width: 350, height: 150} );
            if (result==='OK') {
   
           
            autoUpdater.downloadUpdate()

           
            progressBar = new ProgressBar({
                indeterminate: false,
                text: 'Downloading Update...',
                detail: 'Wait...',
                browserWindow: {
                    closable:true,
                    minimizable:true
                    }
              });
              
              progressBar.on('completed', function() {
                  console.info(`completed...`);
                  progressBar.detail = 'Download completed. Exiting...';
                });

                progressBar.on('aborted', function(value) {
                  console.info(`aborted... ${value}`);
                });

                progressBar.on('progress', function(value) {
                  progressBar.detail = `${value} % out of ${progressBar.getOptions().maxValue} %`;
                });

         } 
    }
        autoUpdater.on('download-progress', (progressObj) => {
            downloadProgress=progressObj.percent;
            setInterval(function() {
                if(!progressBar.isCompleted()){
                  progressBar.value = Math.round(downloadProgress);
                }
              }, 1000);
          })

          autoUpdater.on('update-downloaded',()=> {
            restartInstall();
            async function restartInstall() {
                progressBar=null;
                let result = await eDialog.showDialog(
                      'file:///'+__dirname+'/restartInstall.html', {width: 350, height: 150} );
                if (result==='OK') {
                    autoUpdater.quitAndInstall()
                }
                
            }
    
        })
    })



     
}