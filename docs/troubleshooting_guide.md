# PerfectFit virtual coach troubleshooting guide
This is a document that can be used to track down and fix errors and bugs within the full perfect 
fit system.

###  There is no synced data from the sensor data collector
To check whether sensor data is coming in, the number of steps on this day can be checked by
typing `doel` to the coach. The printed number is the amount of steps recorded today. So if a number
is printed, you are sure that it has been connected today. For android, the SenSeeAct apps should 
give a notification on the phone: 'Measurement is active'

#### Troubleshooting - Problems with bluetooth connection
Make sure there is a bluetooth connection between the phone and watch. Garmin Connect app on the 
phone should display a green circle at the top of the screen. Also, if you hold the `LIGHT` button
on the watch, it will display a green 📞 icon, meaning that the watch is connected to a phone. 

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

#### Troubleshooting - Smartwatch
It appeared that sometimes, the smartwatch had to be restarted. Do the following steps to restart
the watch:
1. Restart the watch
   1. Hold the `LIGHT` button
   2. Select 'Power Off' in the menu. Wait for the device to shut down
   3. To turn the watch on, hold the `LIGHT` button for one second.
   4. Activate the SenSeeAct app on the watch as described in 2.

#### Troubleshooting - SenSeeAct app
The SenSeeAct app should always run in the background. After a phone restart, the SenSeeAct app
should be opened once, to make sure it is running. Battery optimization could also cause the app
to shut itself down after a period of time. This is phone dependent. Often, the following steps 
work for android:
1. Set the battery optimization:
   1. Press the app for several seconds.
   2. Press 'App Info' -> 'Battery Usage'
   3. 'Optimised' can work, but if problems persist, you can set it to 'Unrestricted'

#### Troubleshooting - Other problems
1. Relogin in the SenSeeAct app on the phone if the problem still persists.