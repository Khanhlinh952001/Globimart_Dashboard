
const HTMLDescription: React.FC<{ html: string }> = ({ html }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        maxHeight: '150px',
        overflow: 'auto',
        wordBreak: 'break-word',
      }}
    />
  );
};
export default HTMLDescription;
