(function(){
  var nav=document.getElementById('nav'),hero=document.getElementById('hero'),toTop=document.getElementById('toTop');
  if(hero)hero.classList.add('in');
  function onScroll(){var y=window.scrollY;nav.classList.toggle('scrolled',y>6);toTop.classList.toggle('show',y>700)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  var burger=document.getElementById('burger'),drawer=document.getElementById('drawer'),scrim=document.getElementById('scrim'),dClose=document.getElementById('dClose');
  function oM(){drawer.classList.add('open');scrim.classList.add('open');burger.classList.add('open');burger.setAttribute('aria-expanded','true')}
  function cM(){drawer.classList.remove('open');scrim.classList.remove('open');burger.classList.remove('open');burger.setAttribute('aria-expanded','false')}
  burger.addEventListener('click',oM);dClose.addEventListener('click',cM);scrim.addEventListener('click',cM);
  drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',cM)});

  /* hero carousel */
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var slides=[].slice.call(document.querySelectorAll('.hero .slide')),dotsW=document.getElementById('heroDots');
  if(dotsW&&slides.length){
    var idx=0,timer=null;
    slides.forEach(function(s,i){var b=document.createElement('button');b.setAttribute('aria-label','Slide '+(i+1));if(i===0)b.className='active';b.addEventListener('click',function(){go(i)});dotsW.appendChild(b)});
    var dots=[].slice.call(dotsW.children);
    var show=function(n){slides[idx].classList.remove('active');dots[idx].classList.remove('active');idx=(n+slides.length)%slides.length;slides[idx].classList.add('active');dots[idx].classList.add('active')};
    var go=function(n){show(n);reset()};
    var reset=function(){if(timer)clearInterval(timer);timer=setInterval(function(){show(idx+1)},5000)};
    document.addEventListener('visibilitychange',function(){if(document.hidden){if(timer)clearInterval(timer)}else{reset()}});
    reset();
  }

  /* message tabs */
  var mtabs=document.querySelectorAll('#msgTabs button');
  mtabs.forEach(function(b){b.addEventListener('click',function(){
    mtabs.forEach(function(x){x.classList.remove('active')});b.classList.add('active');
    document.querySelectorAll('.message .mpanel').forEach(function(p){p.classList.remove('active')});
    document.getElementById(b.dataset.p).classList.add('active');
  })});

  /* toppers slideshow */
  document.querySelectorAll('.tcar').forEach(function(car){
    var track=car.querySelector('.tcar-track'),n=track.children.length,
        prev=car.querySelector('.prev'),next=car.querySelector('.next'),count=car.querySelector('.count'),i=0;
    function upd(){track.style.transform='translateX(-'+(i*100)+'%)';if(count)count.textContent=(i+1)+' / '+n}
    prev.addEventListener('click',function(){i=(i-1+n)%n;upd()});
    next.addEventListener('click',function(){i=(i+1)%n;upd()});
    car._reset=function(){i=0;upd()};upd();
  });
  var ttabs=document.querySelectorAll('.ttabs button');
  ttabs.forEach(function(b){b.addEventListener('click',function(){
    ttabs.forEach(function(x){x.classList.remove('active')});b.classList.add('active');
    document.querySelectorAll('.tpanel').forEach(function(p){p.classList.remove('active')});
    var panel=document.getElementById(b.dataset.t);panel.classList.add('active');
    var car=panel.querySelector('.tcar');if(car&&car._reset)car._reset();
  })});

  /* reveal + count-up */
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  function animate(el){var t=+el.dataset.count,suf=el.dataset.suffix||'',s=null,d=1400;
    function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1);el.textContent=Math.floor((1-Math.pow(1-p,3))*t).toLocaleString('en-IN')+suf;if(p<1)requestAnimationFrame(step);else el.textContent=t.toLocaleString('en-IN')+suf}
    requestAnimationFrame(step)}
  var cio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var b=en.target;if(reduce){b.textContent=(+b.dataset.count).toLocaleString('en-IN')+(b.dataset.suffix||'')}else{animate(b)}cio.unobserve(b)}})},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(b){cio.observe(b)});

  /* enquiry form -> school Gmail
     Uses FormSubmit (formsubmit.co): a free service that emails each enquiry to the
     address below. The FIRST enquiry triggers a one-time "Activate form" email to
     that inbox; click the button in it once, and every enquiry after that arrives normally.
     To use your own backend instead, set API_ENQUIRY to its URL (see server-example.js). */
  var SCHOOL_EMAIL = 'drlokmandaspublicschool01@gmail.com';
  var API_ENQUIRY = 'https://formsubmit.co/ajax/' + SCHOOL_EMAIL;
  var form=document.getElementById('enqForm'),note=document.getElementById('enqNote');
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  if(form)form.addEventListener('submit',function(e){e.preventDefault();
    var name=document.getElementById('pname').value.trim();if(!name){document.getElementById('pname').focus();return}
    var phone=document.getElementById('phone').value.trim(),email=document.getElementById('email').value.trim();
    if(!phone&&!email){note.innerHTML='Please add a phone number or an email so the school can reply to you.';note.className='note err show';document.getElementById('phone').focus();return}
    var hp=document.getElementById('hp');
    var data={
      'Name':name,
      'Phone':phone||'-',
      'Email':email||'-',
      'Class of interest':document.getElementById('grade').value||'-',
      'Message':document.getElementById('msg').value.trim()||'-',
      'Sent from':location.href,
      '_subject':'New enquiry from website: '+name,
      '_template':'table',
      '_captcha':'false',
      '_honey':hp?hp.value:''
    };
    if(email)data._replyto=email;
    var btn=form.querySelector('button[type="submit"]'),label=btn.textContent;
    btn.disabled=true;btn.textContent='Sending…';note.className='note';
    fetch(API_ENQUIRY,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json().catch(function(){return {}})})
      .then(function(res){
        if(res&&(res.success===false||res.success==='false'))throw new Error(res.message||'not sent');
        note.innerHTML='Thank you, '+esc(name)+'. Your enquiry has been sent to the school office. We will contact you soon.';
        note.className='note ok show';form.reset();
      })
      .catch(function(){
        note.innerHTML='Sorry, we could not send this right now. Please call <b>7520911618</b> or email '+
          '<a href="mailto:'+SCHOOL_EMAIL+'" style="font-weight:700;text-decoration:underline">'+SCHOOL_EMAIL+'</a>, or try again in a moment.';
        note.className='note err show';
      })
      .then(function(){btn.disabled=false;btn.textContent=label});
  });

  /* gallery filter + lightbox */
  var gF=document.getElementById('gFilter'),mG=document.getElementById('mGal');
  if(gF&&mG){
    var figs=[].slice.call(mG.querySelectorAll('figure'));
    gF.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
      gF.querySelectorAll('button').forEach(function(x){x.classList.remove('active')});b.classList.add('active');
      var f=b.dataset.f;figs.forEach(function(fg){fg.classList.toggle('hide',f!=='all'&&fg.dataset.cat!==f)});
    })});
    var lb=document.getElementById('lb'),lbImg=document.getElementById('lbImg'),lbCap=document.getElementById('lbCap'),cur=0;
    function vis(){return figs.filter(function(fg){return !fg.classList.contains('hide')})}
    function lbShow(fg){var im=fg.querySelector('img');lbImg.src=im.src;lbImg.alt=im.alt;lbCap.textContent=fg.querySelector('figcaption').textContent;cur=vis().indexOf(fg)}
    function lbStep(d){var v=vis();cur=(cur+d+v.length)%v.length;lbShow(v[cur])}
    function lbClose(){lb.classList.remove('show');document.documentElement.style.overflow=''}
    figs.forEach(function(fg){fg.addEventListener('click',function(){lbShow(fg);lb.classList.add('show');document.documentElement.style.overflow='hidden'})});
    document.getElementById('lbX').addEventListener('click',lbClose);
    document.getElementById('lbP').addEventListener('click',function(){lbStep(-1)});
    document.getElementById('lbN').addEventListener('click',function(){lbStep(1)});
    lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('show'))return;if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')lbStep(-1);if(e.key==='ArrowRight')lbStep(1)});
  }

  /* leadership cards: split the thought into words, animate when in view */
  var lcards=document.querySelectorAll('.lcard');
  if(lcards.length){
    lcards.forEach(function(card){
      var q=card.querySelector('.lthought');if(!q)return;
      var words=q.textContent.trim().split(/\s+/);
      q.innerHTML=words.map(function(w,i){return '<span class="w" style="--i:'+i+'">'+w.replace(/[&<>]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]})+'</span>'}).join(' ');
      card.style.setProperty('--qd',(0.95+words.length*0.07+0.35).toFixed(2)+'s');
    });
    var lio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');lio.unobserve(en.target)}})},{threshold:.3});
    lcards.forEach(function(c){lio.observe(c)});
  }

  /* popup */
  var pop=document.getElementById('popScrim');
  if(pop){
    var track=document.getElementById('popTrack'),pdots=[].slice.call(document.querySelectorAll('#popDots button')),
        nextBtn=document.getElementById('popNext'),page=0,seen=false;
    try{seen=sessionStorage.getItem('ldps_pop_2526')==='1'}catch(e){}
    function setPage(n){page=n;track.style.transform='translateX(-'+(n*50)+'%)';
      pdots.forEach(function(d,i){d.classList.toggle('active',i===n)});
      nextBtn.textContent=n===0?'Class XII →':'← Class X';}
    pdots.forEach(function(d,i){d.addEventListener('click',function(){setPage(i)})});
    nextBtn.addEventListener('click',function(){setPage(page===0?1:0)});
    function pOpen(){pop.classList.add('show');document.documentElement.style.overflow='hidden'}
    function pClose(){pop.classList.remove('show');document.documentElement.style.overflow='';try{sessionStorage.setItem('ldps_pop_2526','1')}catch(e){}}
    if(!seen){setTimeout(pOpen,650)}
    document.getElementById('popClose').addEventListener('click',pClose);
    document.getElementById('popView').addEventListener('click',pClose);
    pop.addEventListener('click',function(e){if(e.target===pop)pClose()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')pClose()});
  }
})();
