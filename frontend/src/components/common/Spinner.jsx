import PropTypes from 'prop-types';

const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

Spinner.propTypes = {
  label: PropTypes.string,
};

export default Spinner;
