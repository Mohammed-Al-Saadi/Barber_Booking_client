// exceptionsUtils.js
export const resetForm = (setters) => {
    const { setExceptionDate, setCustomStartTime, setCustomEndTime, setIsOff, setIsFormVisible } = setters;
    
    setExceptionDate("");
    setCustomStartTime("");
    setCustomEndTime("");
    setIsOff(false);
    setIsFormVisible(false); 
  };
  