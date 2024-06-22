

   function  welcometext(name){
        let txt=` Dear ${name},

We extend a warm and heartfelt welcome to you on behalf of LegalawernessHUB. Your decision to join our community is greatly appreciated, and we are thrilled to have you with us.

At LegalawernessHUB, we are committed to disseminating profound legal knowledge and fostering a community of well-informed individuals. Our platform is meticulously crafted to provide you with insightful resources, compelling discussions, and unparalleled support in navigating the labyrinthine world of law.

As you embark on this intellectual journey with us, we encourage you to explore the myriad of features and benefits that our hub offers. From comprehensive articles and case studies to interactive forums and expert consultations, we have curated a wealth of information to satiate your legal curiosity and bolster your acumen.

Our mission is not only to inform but also to empower you. We believe that knowledge is the bedrock of justice and advocacy. Therefore, we strive to equip you with the tools necessary to comprehend and influence the legal landscape.

Should you have any inquiries or require assistance, our dedicated team stands ready to assist you. Do not hesitate to reach out; your engagement is invaluable to us.

Once again, welcome to LegalawernessHUB. We look forward to a fruitful and enlightening association.

Warm regards,

The LegalawernessHUB Team
`
return txt
    }
  function  otptext(otp){
      let  txt=`
      Subject: Verification OTP for LegalawernessHUB

Dear Esteemed User,

We hope this message finds you in good spirits. To proceed with your account verification on LegalawernessHUB, please utilize the following One-Time Password (OTP). This OTP is a critical security measure to ensure the sanctity and confidentiality of your account.

**Your OTP: [${otp}]**

For your safety, this code is valid only for the next 10 minutes. To finalize your verification, kindly input this OTP on the LegalawernessHUB platform.

Should you encounter any difficulties or have any inquiries, please do not hesitate to reach out to our support team .

Thank you for choosing LegalawernessHUB. We are dedicated to providing you with impeccable service and unwavering security.

Best Regards,

The LegalawernessHUB Team



**Note:** If you did not initiate this verification, please inform us immediately to safeguard your account.
      `
      return txt
    }



module.exports = { welcometext,  otptext};