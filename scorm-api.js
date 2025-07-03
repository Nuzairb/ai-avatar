/**
 * SCORM API Wrapper for AI Avatar Chatbot
 * Handles communication with SCORM-compliant Learning Management Systems
 */

class SCORMWrapper {
  constructor() {
    this.API = null;
    this.isInitialized = false;
    this.startTime = new Date();
    this.interactions = [];
    this.completionStatus = 'incomplete';
    this.successStatus = 'unknown';
    this.scoreRaw = 0;
    this.scoreMax = 100;
    this.scoreMin = 0;
    this.sessionTime = 'PT0H0M0S';
    
    this.findAPI();
  }

  /**
   * Find SCORM API in parent windows
   */
  findAPI() {
    let theAPI = null;
    let findAPITries = 0;
    const maxTries = 500;
    
    while (!theAPI && findAPITries < maxTries) {
      findAPITries++;
      
      // Check current window
      if (window.API_1484_11) {
        theAPI = window.API_1484_11;
        break;
      }
      
      // Check parent windows
      let currentWindow = window;
      for (let i = 0; i < findAPITries && currentWindow.parent; i++) {
        currentWindow = currentWindow.parent;
        if (currentWindow.API_1484_11) {
          theAPI = currentWindow.API_1484_11;
          break;
        }
      }
      
      // Check opener window
      if (!theAPI && window.opener && window.opener.API_1484_11) {
        theAPI = window.opener.API_1484_11;
      }
      
      if (!theAPI) {
        // Wait a bit before trying again
        setTimeout(() => {}, 1);
      }
    }
    
    this.API = theAPI;
    
    if (this.API) {
      console.log('SCORM API found successfully');
      this.initialize();
    } else {
      console.warn('SCORM API not found - running in standalone mode');
    }
    
    return this.API;
  }

  /**
   * Initialize SCORM session
   */
  initialize() {
    if (!this.API) return false;
    
    try {
      const result = this.API.Initialize('');
      if (result === 'true') {
        this.isInitialized = true;
        console.log('SCORM session initialized');
        
        // Set initial values
        this.setCompletionStatus('incomplete');
        this.setSuccessStatus('unknown');
        this.setScore(0);
        
        // Get learner information
        const learnerName = this.getValue('cmi.learner_name');
        const learnerId = this.getValue('cmi.learner_id');
        
        console.log(`Learner: ${learnerName} (ID: ${learnerId})`);
        
        return true;
      } else {
        console.error('Failed to initialize SCORM session');
        return false;
      }
    } catch (error) {
      console.error('Error initializing SCORM:', error);
      return false;
    }
  }

  /**
   * Set a SCORM data model value
   */
  setValue(element, value) {
    if (!this.API || !this.isInitialized) return false;
    
    try {
      const result = this.API.SetValue(element, value);
      if (result === 'true') {
        console.log(`SCORM: Set ${element} = ${value}`);
        return true;
      } else {
        console.error(`SCORM: Failed to set ${element} = ${value}`);
        return false;
      }
    } catch (error) {
      console.error(`Error setting SCORM value ${element}:`, error);
      return false;
    }
  }

  /**
   * Get a SCORM data model value
   */
  getValue(element) {
    if (!this.API || !this.isInitialized) return '';
    
    try {
      const value = this.API.GetValue(element);
      console.log(`SCORM: Get ${element} = ${value}`);
      return value;
    } catch (error) {
      console.error(`Error getting SCORM value ${element}:`, error);
      return '';
    }
  }

  /**
   * Commit data to LMS
   */
  commit() {
    if (!this.API || !this.isInitialized) return false;
    
    try {
      const result = this.API.Commit('');
      if (result === 'true') {
        console.log('SCORM: Data committed successfully');
        return true;
      } else {
        console.error('SCORM: Failed to commit data');
        return false;
      }
    } catch (error) {
      console.error('Error committing SCORM data:', error);
      return false;
    }
  }

  /**
   * Terminate SCORM session
   */
  terminate() {
    if (!this.API || !this.isInitialized) return false;
    
    try {
      // Update session time before terminating
      this.updateSessionTime();
      this.commit();
      
      const result = this.API.Terminate('');
      if (result === 'true') {
        this.isInitialized = false;
        console.log('SCORM session terminated');
        return true;
      } else {
        console.error('Failed to terminate SCORM session');
        return false;
      }
    } catch (error) {
      console.error('Error terminating SCORM session:', error);
      return false;
    }
  }

  /**
   * Set completion status
   */
  setCompletionStatus(status) {
    this.completionStatus = status;
    return this.setValue('cmi.completion_status', status);
  }

  /**
   * Set success status
   */
  setSuccessStatus(status) {
    this.successStatus = status;
    return this.setValue('cmi.success_status', status);
  }

  /**
   * Set score
   */
  setScore(raw, min = 0, max = 100) {
    this.scoreRaw = raw;
    this.scoreMin = min;
    this.scoreMax = max;
    
    // Calculate scaled score (0-1)
    const scaled = max > min ? (raw - min) / (max - min) : 0;
    
    this.setValue('cmi.score.raw', raw.toString());
    this.setValue('cmi.score.min', min.toString());
    this.setValue('cmi.score.max', max.toString());
    this.setValue('cmi.score.scaled', scaled.toString());
    
    // Set success status based on score
    if (raw >= 80) { // 80% mastery threshold
      this.setSuccessStatus('passed');
    } else if (raw > 0) {
      this.setSuccessStatus('failed');
    }
    
    return true;
  }

  /**
   * Add interaction record
   */
  addInteraction(id, type, response, result, description = '') {
    const interaction = {
      id: id,
      type: type,
      timestamp: new Date().toISOString(),
      response: response,
      result: result,
      description: description
    };
    
    this.interactions.push(interaction);
    const index = this.interactions.length - 1;
    
    // Set SCORM interaction data
    this.setValue(`cmi.interactions.${index}.id`, id);
    this.setValue(`cmi.interactions.${index}.type`, type);
    this.setValue(`cmi.interactions.${index}.timestamp`, interaction.timestamp);
    this.setValue(`cmi.interactions.${index}.learner_response`, response);
    this.setValue(`cmi.interactions.${index}.result`, result);
    
    if (description) {
      this.setValue(`cmi.interactions.${index}.description`, description);
    }
    
    console.log('SCORM: Added interaction', interaction);
    return index;
  }

  /**
   * Update session time
   */
  updateSessionTime() {
    const now = new Date();
    const duration = now - this.startTime;
    
    // Convert to ISO 8601 duration format (PT#H#M#S)
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    this.sessionTime = `PT${hours}H${minutes}M${seconds}S`;
    this.setValue('cmi.session_time', this.sessionTime);
    
    return this.sessionTime;
  }

  /**
   * Get learner information
   */
  getLearnerInfo() {
    return {
      id: this.getValue('cmi.learner_id'),
      name: this.getValue('cmi.learner_name'),
      preference: {
        language: this.getValue('cmi.learner_preference.language'),
        audioLevel: this.getValue('cmi.learner_preference.audio_level'),
        audioState: this.getValue('cmi.learner_preference.audio_captioning')
      }
    };
  }

  /**
   * Set progress measure (0.0 to 1.0)
   */
  setProgressMeasure(progress) {
    return this.setValue('cmi.progress_measure', progress.toString());
  }

  /**
   * Check if SCORM is available
   */
  isAvailable() {
    return this.API !== null && this.isInitialized;
  }

  /**
   * Get error information
   */
  getLastError() {
    if (!this.API) return null;
    
    try {
      const errorCode = this.API.GetLastError();
      const errorString = this.API.GetErrorString(errorCode);
      const diagnostic = this.API.GetDiagnostic(errorCode);
      
      return {
        code: errorCode,
        string: errorString,
        diagnostic: diagnostic
      };
    } catch (error) {
      return { code: 'Unknown', string: 'API Error', diagnostic: error.message };
    }
  }
}

// Global SCORM instance
window.scorm = new SCORMWrapper();

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.scorm && window.scorm.isAvailable()) {
    window.scorm.updateSessionTime();
    window.scorm.commit();
    window.scorm.terminate();
  }
});

// Auto-commit data every 30 seconds
setInterval(() => {
  if (window.scorm && window.scorm.isAvailable()) {
    window.scorm.updateSessionTime();
    window.scorm.commit();
  }
}, 30000); 