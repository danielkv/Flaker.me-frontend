import AutoLaunch from 'auto-launch';

const FlakerLauncher = new AutoLaunch({
	name: 'Flaker.me',
	// path: '/Applications/Minecraft.app',
});
 
FlakerLauncher.isEnabled()
	.then((isEnabled) => {
		if (isEnabled) return;
	
		FlakerLauncher.enable();
	});