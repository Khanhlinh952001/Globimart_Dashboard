export default function generateRandomString(length: number = 9): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result: string = '';
    const charactersLength: number = characters.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    
    return result;
  }
  
  // Ví dụ sử dụng
  const randomString: string = generateRandomString();
  console.log(randomString); // Ví dụ: 'X7Y8Z9A1B'
  