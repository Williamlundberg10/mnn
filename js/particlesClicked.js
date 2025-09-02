particlesJS('particlesClick',
  
  {
    "particles": {
      "number": {
        "value": 0,
        "density": {
          "enable": false,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.75,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable":false,
          "speed": 10,
          "size_min": 3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },

      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "destroy",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },

    "life": {
      "duration": {
        "value": 1 
      }
    },
    

    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push",


        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 40,
        },
        "remove": {
          "particles_nb": 20,
          "delay": 5000
        }
      }
    },
    "retina_detect": true,


    
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover",
    }

  });


  const audioFiles = [
     f1 = document.getElementById("f1").src,
     f2 = document.getElementById("f2").src,
     f4 = document.getElementById("f4").src,
     f5 = document.getElementById("f5").src,
     f6 = document.getElementById("f6").src,
     f7 = document.getElementById("f7").src,
     f8 = document.getElementById("f8").src,
     f9 = document.getElementById("f9").src,
     f10 = document.getElementById("f10").src,
     f11 = document.getElementById("f11").src,
     f12 = document.getElementById("f12").src,
     f13 = document.getElementById("f13").src,
     f14 = document.getElementById("f14").src,
     f15 = document.getElementById("f15").src
    ];
  let currentIndex = 0;

  const particleJSConfig = {
    "particles": {
      "number": {
        "value": 0,
        "density": {
          "enable": false,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.75,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable":false,
          "speed": 10,
          "size_min": 3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },

      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "destroy",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },

    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push",


        },
        "resize": true
      },
      "modes": {

        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 40,
        },
      }
    },
    "retina_detect": true,


    
    "config_demo": {
      "hide_card": false,
      "background_color": "#b61924",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover",
    }

  };


  function playParticleSound() {
    const selectedAudio = audioFiles[currentIndex];
    const particleSound = new Audio(selectedAudio);
    particleSound.play();
  
    currentIndex++;
  
    if (currentIndex >= audioFiles.length) {
      currentIndex = 0;
  }
  
  }