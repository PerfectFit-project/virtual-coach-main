# PerfectFit virtual coach troubleshooting guide
This is a document that can be used to track down and fix errors and bugs within the full perfect 
fit system.

###  There is no synced data from the sensor data collector
To check whether sensor data is coming in, the number of steps on this day can be checked by
typing `doel` to the coach. The printed number is the amount of steps recorded today. So if a number
is printed, you are sure that it has been connected today. The SenSeeAct apps should give a
notification on the phone: 'Measurement is active'

#### Troubleshooting - Problems with bluetooth connection
Make sure there is a bluetooth connection between the phone and watch. Garmin Connect app on the phone should display
a green circle at the top of the screen. Also, if you hold the `LIGHT` button on the watch, it will
display a green 📞 icon, meaning that the watch is connected to a phone. 

If there is no connection, the following steps could be tried:
1. Make sure the bluetooth on the phone is ON.
2. Make sure bluetooth is ON, on the watch:
   1. Hold the `LIGHT` button
   2. Navigate to the 📞 icon.
   3. Press `START` and make sure there is no diagonal line through the 📞 icon.
3. The watch can get into 'Energy saving mode', disabling bluetooth. To disable energy save mode:
   1. Hold the `LIGHT` button
   2. Navigate to the 📞 icon.
   3. Press `START` and make sure there is no diagonal line through the 📞 icon.

#### Troubleshooting - Other problems
If problems still persist, the following steps could be tried:
1. Open the SenSeeAct app to make sure the app is running.
   1. Relogin in the SenSeeAct app on the phone if the problem still persists.
   2. Make sure that battery optimization settings for the SenSeeAct app are disabled. For Android:
      1. This is phone dependent. Often it can be seen when pressing the app for several seconds
      2. Press 'App Info' -> 'Battery Usage'
      3. 'Optimised' can work, but if problems persist, you can set it to 'Unrestricted'
2. Reactivate the SenSeeAct app on the watch.
   1. Press the `START` button
   2. Navigate with the `UP` and `DOWN` button to SenSeeAct in the list
   3. Press `START` when SenSeeAct is chosen
   4. After the SenSeeAct app is shown on the screen, press `BACK`
3. Restart the watch
   1. Hold the `LIGHT` button
   2. Select 'Power Off' in the menu. Wait for the device to shut down
   3. To turn the watch on, hold the `LIGHT` button for one second.
   4. Activate the SenSeeAct app on the watch as described in 2.
