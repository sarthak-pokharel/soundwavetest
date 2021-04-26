

const $ = document.querySelectorAll.bind(document);

const audioDuration = 200;
let changeinterval;
let dfx = 100;
let freqrange = [100, 2000];
let freqchangeinterval = 1;
let timeLapse = 0;

//angular velocity (omega(w)) of sound wave
let waveshrink = 4;
//Phase difference
let phase_difference = 0;

const audioState = Object.create({
	playing: false,
	oscillator: null,
	gainNode: null,
	oscillating: false
});

function Main(){
	let player = $("#play")[0];
	player.addEventListener("click", function(){
		if(!audioState.oscillating){
			this.innerText = "Pause";
			startOscillation();
			playSound();
		}else{
			this.innerText = "Play"
			stopper();
		}
	});
}


function playSound(){

	audioState.playing = true;

	let context = new AudioContext()
	let o = context.createOscillator()
	
	audioState.oscillator = o;
	// audioState.gainNode = gainNode;

	// oscillator
	o.frequency.value = freqrange[0];
	o.connect(context.destination)
	o.start(0)
	o.stop(context.currentTime + audioDuration);
	o.onended = function(){
		stopper();
	}
}

function stopper(){
	audioState.oscillating = false;
	clearInterval(changeinterval);
	audioState.oscillator.stop();
}

function startOscillation(){
	changeinterval = setInterval(function(){
		timeLapse += freqchangeinterval;
		let ctime = Date.now();
		audioState.oscillator.frequency.value = 
				freqrange[0]+ (
					(freqrange[1]-freqrange[0]) *
									Math.abs(
										//Asin(wt+phi):
											Math.sin(waveshrink*
												(ctime*Math.PI/freqrange[1])
												+phase_difference
												)));
	}, freqchangeinterval);
	audioState.oscillating = true;
}


window.onload = () => Main();