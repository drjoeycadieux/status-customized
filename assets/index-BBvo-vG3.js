var u=Object.defineProperty;var h=(o,e,t)=>e in o?u(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var a=(o,e,t)=>h(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const r={OPERATIONAL:"operational",DEGRADED:"degraded",OUTAGE:"outage",MAINTENANCE:"maintenance",UNKNOWN:"unknown"},l={INVESTIGATING:"investigating",IDENTIFIED:"identified",MONITORING:"monitoring",RESOLVED:"resolved"};class d{constructor(e,t=6e4){a(this,"services",[]);a(this,"checkInterval",6e4);a(this,"intervalId",null);this.services=e,this.checkInterval=t}startMonitoring(){this.stopMonitoring(),this.checkAllServices(),this.intervalId=window.setInterval(()=>{this.checkAllServices()},this.checkInterval)}stopMonitoring(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}async checkAllServices(){return(await Promise.allSettled(this.services.map(t=>this.checkService(t)))).map((t,i)=>{var s;return t.status==="fulfilled"?t.value:{serviceId:this.services[i].id,status:r.OUTAGE,responseTime:0,timestamp:new Date,error:((s=t.reason)==null?void 0:s.message)||"Unknown error"}})}async checkService(e){const t=Date.now();try{const i=await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(e.url)}`,{method:"GET",mode:"cors",headers:{"Content-Type":"application/json"},signal:AbortSignal.timeout(1e4)}),s=Date.now()-t;let n;return i.ok?s<1e3?n=r.OPERATIONAL:(s<3e3,n=r.DEGRADED):n=r.OUTAGE,{serviceId:e.id,status:n,responseTime:s,timestamp:new Date}}catch(i){const s=Date.now()-t;return{serviceId:e.id,status:r.OUTAGE,responseTime:s,timestamp:new Date,error:i instanceof Error?i.message:"Network error"}}}updateService(e,t){const i=this.services.find(s=>s.id===e);i&&(i.status=t.status,i.responseTime=t.responseTime,i.lastChecked=t.timestamp)}getServices(){return this.services}addService(e){this.services.push(e)}removeService(e){this.services=this.services.filter(t=>t.id!==e)}}class m{constructor(e){a(this,"container");this.container=e}render(e,t){this.container.innerHTML=`      <header class="header">
        <div class="container">
          <h1 class="title">
            <span class="icon">🛡️</span>
            Service Status Dashboard
          </h1>
          <p class="description">Monitor the operational status of our services • Theme support enabled</p>
        </div>
      </header>

      <main class="main">
        <div class="container">
          ${this.renderOverallStatus(e)}
          ${this.renderServices(e)}
          ${this.renderIncidents(t)}
        </div>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Service Status Dashboard - Last updated: ${new Date().toLocaleString()}</p>
        </div>
      </footer>
    `}renderOverallStatus(e){const t=e.filter(c=>c.status===r.OPERATIONAL).length,i=e.length;let s=r.OPERATIONAL,n="All systems operational";return t===0?(s=r.OUTAGE,n="Major service outage"):t<i&&(s=r.DEGRADED,n="Some services experiencing issues"),`
      <section class="overall-status ${s}">
        <div class="status-indicator">
          <span class="status-icon">${this.getStatusIcon(s)}</span>
          <div class="status-text">
            <h2>${n}</h2>
            <p>${t} of ${i} services operational</p>
          </div>
        </div>
      </section>
    `}renderServices(e){return`
      <section class="services">
        <h2>Services</h2>
        <div class="services-list">
          ${e.map(t=>this.renderService(t)).join("")}
        </div>
      </section>
    `}renderService(e){const t=(e.uptime*100).toFixed(2),i=e.responseTime;return`
      <div class="service-card ${e.status}">
        <div class="service-header">
          <h3 class="service-name">${e.name}</h3>
          <span class="service-status ${e.status}">
            ${this.getStatusIcon(e.status)}
            ${this.getStatusText(e.status)}
          </span>
        </div>
        
        ${e.description?`<p class="service-description">${e.description}</p>`:""}
        
        <div class="service-metrics">
          <div class="metric">
            <span class="metric-label">Uptime</span>
            <span class="metric-value">${t}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Response Time</span>
            <span class="metric-value">${i}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">Last Checked</span>
            <span class="metric-value">${this.formatRelativeTime(e.lastChecked)}</span>
          </div>
        </div>
      </div>
    `}renderIncidents(e){return e.length===0?`
        <section class="incidents">
          <h2>Incidents</h2>
          <div class="no-incidents">
            <span class="icon">✅</span>
            <p>No recent incidents to report</p>
          </div>
        </section>
      `:`
      <section class="incidents">
        <h2>Recent Incidents</h2>
        <div class="incidents-list">
          ${e.slice(0,5).map(t=>this.renderIncident(t)).join("")}
        </div>
      </section>
    `}renderIncident(e){return`
      <div class="incident-card ${e.severity}">
        <div class="incident-header">
          <h3 class="incident-title">${e.title}</h3>
          <div class="incident-meta">
            <span class="incident-status ${e.status}">${this.getIncidentStatusText(e.status)}</span>
            <span class="incident-severity ${e.severity}">${e.severity.toUpperCase()}</span>
          </div>
        </div>
        
        <p class="incident-description">${e.description}</p>
        
        <div class="incident-timeline">
          <div class="incident-time">
            <span class="time-label">Started:</span>
            <span class="time-value">${this.formatDate(e.createdAt)}</span>
          </div>
          ${e.resolvedAt?`
            <div class="incident-time">
              <span class="time-label">Resolved:</span>
              <span class="time-value">${this.formatDate(e.resolvedAt)}</span>
            </div>
          `:""}
        </div>
        
        ${e.affectedServices.length>0?`
          <div class="affected-services">
            <span class="label">Affected Services:</span>
            ${e.affectedServices.map(t=>`<span class="service-tag">${t}</span>`).join("")}
          </div>
        `:""}
      </div>
    `}getStatusIcon(e){switch(e){case r.OPERATIONAL:return"🟢";case r.DEGRADED:return"🟡";case r.OUTAGE:return"🔴";case r.MAINTENANCE:return"🔧";default:return"⚪"}}getStatusText(e){switch(e){case r.OPERATIONAL:return"Operational";case r.DEGRADED:return"Degraded Performance";case r.OUTAGE:return"Service Outage";case r.MAINTENANCE:return"Under Maintenance";default:return"Unknown"}}getIncidentStatusText(e){switch(e){case l.INVESTIGATING:return"Investigating";case l.IDENTIFIED:return"Identified";case l.MONITORING:return"Monitoring";case l.RESOLVED:return"Resolved";default:return"Unknown"}}formatDate(e){return e.toLocaleString()}formatRelativeTime(e){const i=Math.floor((new Date().getTime()-e.getTime())/1e3);if(i<60)return`${i} seconds ago`;if(i<3600){const s=Math.floor(i/60);return`${s} minute${s>1?"s":""} ago`}else if(i<86400){const s=Math.floor(i/3600);return`${s} hour${s>1?"s":""} ago`}else{const s=Math.floor(i/86400);return`${s} day${s>1?"s":""} ago`}}}class p{constructor(){a(this,"currentTheme","auto");a(this,"toggleButton",null);this.init()}init(){const e=localStorage.getItem("theme");this.currentTheme=e||"auto",this.applyTheme(),this.createToggleButton(),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.currentTheme==="auto"&&this.applyTheme()})}createToggleButton(){this.toggleButton=document.createElement("button"),this.toggleButton.className="theme-toggle",this.toggleButton.setAttribute("aria-label","Toggle theme"),this.toggleButton.setAttribute("title","Toggle theme"),this.updateToggleButton(),this.toggleButton.addEventListener("click",()=>{this.toggleTheme()}),document.body.appendChild(this.toggleButton)}updateToggleButton(){if(!this.toggleButton)return;switch(this.getEffectiveTheme()){case"dark":this.toggleButton.innerHTML="🌙",this.toggleButton.title="Switch to light theme";break;case"light":this.toggleButton.innerHTML="☀️",this.toggleButton.title="Switch to dark theme";break}}toggleTheme(){switch(this.currentTheme){case"auto":this.setTheme("light");break;case"light":this.setTheme("dark");break;case"dark":this.setTheme("auto");break}}setTheme(e){this.currentTheme=e,localStorage.setItem("theme",e),this.applyTheme(),this.updateToggleButton()}applyTheme(){const e=this.getEffectiveTheme();document.documentElement.removeAttribute("data-theme"),this.currentTheme!=="auto"&&document.documentElement.setAttribute("data-theme",e),this.updateMetaThemeColor(e)}getEffectiveTheme(){return this.currentTheme==="auto"?window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":this.currentTheme}updateMetaThemeColor(e){let t=document.querySelector('meta[name="theme-color"]');t||(t=document.createElement("meta"),t.setAttribute("name","theme-color"),document.head.appendChild(t));const i=e==="dark"?"#0f172a":"#ffffff";t.setAttribute("content",i)}getCurrentTheme(){return this.currentTheme}isDarkTheme(){return this.getEffectiveTheme()==="dark"}}class g{constructor(){a(this,"config");a(this,"monitor");a(this,"ui");a(this,"themeManager");this.themeManager=new p,this.config={siteName:"Service Status Dashboard",description:"Real-time status monitoring for our services",services:[],incidents:[],refreshInterval:6e4,theme:"auto"},this.monitor=new d(this.config.services,this.config.refreshInterval),this.ui=new m(document.querySelector("#app")),this.init()}async init(){await this.loadConfiguration(),this.ui.render(this.config.services,this.config.incidents),this.monitor.startMonitoring(),this.setupPeriodicUpdates(),await this.updateServiceStatuses(),console.log("🎨 Theme manager initialized, current theme:",this.themeManager.getCurrentTheme())}async loadConfiguration(){try{console.log("🔄 Attempting to load config from ./config/services.json");const e=new Date().getTime();let t=await fetch(`./config/services.json?t=${e}`,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"},cache:"no-cache"});if(console.log("📡 Config fetch response:",t.status,t.statusText),t.ok||(console.log("⚠️ Static config failed, trying Netlify function..."),t=await fetch(`/.netlify/functions/config?t=${e}`,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"},cache:"no-cache"}),console.log("📡 Function fetch response:",t.status,t.statusText)),!t.ok)throw console.warn("⚠️ Could not load external config, using embedded configuration"),new Error(`Failed to load services configuration: ${t.status} ${t.statusText}`);const i=await t.json();if(console.log("📋 Raw config data:",i),!i.services||!Array.isArray(i.services))throw new Error("Invalid config format: services array not found");this.config.services=i.services.map(s=>({id:s.id,name:s.name,url:s.url,status:r.UNKNOWN,uptime:.999,responseTime:0,lastChecked:new Date,description:s.description})),this.monitor=new d(this.config.services,this.config.refreshInterval),console.log("✅ Configuration loaded successfully:",this.config.services.length,"services"),console.log("🔧 Services:",this.config.services.map(s=>({id:s.id,name:s.name,url:s.url})))}catch(e){console.error("❌ Failed to load external configuration, using embedded config:",e),this.config=this.createEmbeddedConfig(),console.log("🔧 Using embedded config with services:",this.config.services.map(t=>({id:t.id,name:t.name,url:t.url})))}}createEmbeddedConfig(){return{siteName:"Service Status Dashboard",description:"Real-time status monitoring for our services",services:[{id:"joeycadieux-website",name:"Joey Cadieux Portfolio",url:"https://joeycadieux.dev",status:r.UNKNOWN,uptime:.999,responseTime:0,lastChecked:new Date,description:"Personal portfolio and blog website"},{id:"softwarefoundations-website",name:"Software Foundations",url:"https://softwarefoundations.cloud",status:r.UNKNOWN,uptime:.999,responseTime:0,lastChecked:new Date,description:"Software Foundations main website"}],incidents:[],refreshInterval:6e4,theme:"auto"}}setupPeriodicUpdates(){setInterval(async()=>{await this.updateServiceStatuses(),this.ui.render(this.config.services,this.config.incidents)},this.config.refreshInterval)}async updateServiceStatuses(){try{const e=await this.monitor.checkAllServices();e.forEach(t=>{this.monitor.updateService(t.serviceId,t)}),this.ui.render(this.config.services,this.config.incidents),console.log("Service statuses updated:",e)}catch(e){console.error("Failed to update service statuses:",e)}}}document.addEventListener("DOMContentLoaded",()=>{new g});
