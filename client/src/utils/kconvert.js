const kconvert = {
  convertTo: (salary) => {
    if (typeof salary !== 'number') return salary;
    if (salary >= 100000) {
      return (salary / 100000).toFixed(2) + ' LPA';
    }
    if (salary >= 1000) {
      return (salary / 1000).toFixed(0) + ' K';
    }
    return salary;
  }
};

export default kconvert; 