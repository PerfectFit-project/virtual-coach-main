# PerfectFit virtual coach troubleshooting guide
This is a document that can be used to track down and fix errors and bugs within the full perfect 
fit system.

###  There is no synced data from the sensor data collector
To check whether sensor data is coming in, the number of steps on this day can be checked by
typing `doel` to the coach. If a number is printed, at least this day, data came in.

To have data uploaded from the smartwatch to the SenSeeAct server, the following requirements are needed:
1. The watch is charged, worn and bluetooth is on. The SenSeeAct app is running on the watch.
2. The phone has the SenSeeAct app running, the watch is connected to the phone with bluetooth and the phone is connected to the 
internet. Whether the phone-watch connection status is seen in the Garmin Connect app. This will have a green 
circle in the right top corner after opening. When the SenSeeAct app on the phone is open, it would
display that it is measuring the physical activity when working correctly. There should always be a notification that the
SenSeeAct app is running on the phone.

#### Troubleshooting
1. Check the bluetooth connection with the watch in Garmin Connect (top right should have a green circle).
   1. The watch can get into 'Energy saving mode', disabling bluetooth.
2. Open the SenSeeAct app to make sure the app is running.
   1. Relogin in the SenSeeAct app on the phone if the problem still persists.
3. Reactivate the SenSeeAct app on the watch.
