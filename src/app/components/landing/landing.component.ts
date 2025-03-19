import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavComponent,
    CommonModule,
    FooterComponent
],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  constructor() { }

  slogan: boolean = false;
  logoAnimationComplete: boolean = false;
  animaitonComplete: boolean = false;

  ngAfterViewInit() {
    this.setupAnimations();
    this.trackScroll();
  }

  ngOnDestroy() {
    this.slogan = false;
    window.removeEventListener('scroll', this.checkScrollLevel);
  }

  setupAnimations() {
    const logo = document.querySelector('.image');
    const text = document.querySelector('.text');
    const slogan = document.querySelector('.slogan-text');

    gsap.set(slogan, { display: 'none' });

    gsap.to(text, {
      x: '100vw',
      marginLeft: '0',
      scrollTrigger: {
        trigger: text,
        start: '70% center',
        end: '200% center',
        scrub: true,
        markers: false,
        onLeaveBack: () => {
          gsap.to(text, { x: '0', marginLeft: 'auto' });
        }
      }
    });

    gsap.to(logo, {
      x: '25vw',
      scale: 2,
      marginRight: '0',
      scrollTrigger: {
        trigger: logo,
        start: '70% center',
        end: '200% center',
        scrub: true,
        markers: false,
        onLeave: () => {
          this.logoAnimationComplete = true;
          this.setupSecondAnimation();
        },
        onEnterBack: () => {
          this.logoAnimationComplete = false;
          gsap.to(logo, { x: '0', scale: 1, marginRight: 'auto' });
          gsap.to(text, { x: '0', marginLeft: 'auto' });
          gsap.set(slogan, { display: 'none' });
        },
      }
    });
  }

  setupSecondAnimation() {
    const logo = document.querySelector('.image');
    const slogan = document.querySelector('.slogan-text');

    slogan?.setAttribute('style', 'display: block; margin-top: 10vh;');

    gsap.to(slogan, {
      y: '0',
      scrollTrigger: {
        trigger: slogan,
        start: '200% center',
        end: '300% center',
        scrub: true,
        markers: false,
        onEnter: () => {
          this.slogan = true;
        },
        onLeave: () => {
          this.finalAnimation();
        },
        onEnterBack: () => {
          this.slogan = true;
          gsap.to(slogan, { y: '0' });
        },
        onLeaveBack: () => {
          gsap.to(slogan, { y: '10vh' });
        }
      }
    });
  }

  finalAnimation() {
    const animation = document.querySelector('.animated-section');
  
    gsap.to(animation, {
      y: '-200%',
      scrollTrigger: {
        trigger: animation,
        start: '80% center',
        end: '300% center',
        scrub: 1,
        onEnterBack: () => {
          gsap.to(animation, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          });
        },
        onLeaveBack: () => {
          gsap.to(animation, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          });
        }
      }
    });
  }

  scroll: number = 0;

  trackScroll() {
    window.addEventListener('scroll', this.checkScrollLevel);
  }

  checkScrollLevel = () => {
    this.scroll = window.scrollY;

    if (this.scroll > 1100) {
      this.animaitonComplete = true;
    } else if (this.scroll < 900) {
      this.animaitonComplete = false;
    }
  };

}