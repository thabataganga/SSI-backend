const emailTemplate = ({ destinatario, assunto, texto, html }) => {
  // Message object
  const emailUser = process.env.EMAIL_FROM;

  let message = {
    from: emailUser,

    // Comma separated list of recipients
    to: destinatario,
    // bcc: 'andris@ethereal.email',

    // Subject of the message
    subject: assunto,

    // plaintext body
    text: texto,

    // HTML body
    html: html,

    // An array of attachments
    /* 
         attachments: [
             // String attachment
             {
                 filename: 'notes.txt',
                 content: 'Some notes about this e-mail',
                 contentType: 'text/plain' // optional, would be detected from the filename
             },
         */
    // Binary Buffer attachment
    /*   {
               filename: 'image.png',
               content: Buffer.from(
                   'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                       '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                       'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                   'base64'
               ),
               cid: 'note@example.com' // should be as unique as possible
           },
       
           // File Stream attachment
           {
               filename: 'nyan cat ✔.gif',
               path: __dirname + '/assets/nyan.gif',
               cid: 'nyan@example.com' // should be as unique as possible
           }
       ]
           */
  };

  return message;
};

module.exports = emailTemplate;
