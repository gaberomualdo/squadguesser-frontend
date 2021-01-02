import './styles.css';

const Loading = (props) => {
  return <div {...props} className={`loadercomponent ${props.className}`}></div>;
};
export default Loading;
