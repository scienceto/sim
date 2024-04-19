import '../App.css';
import AyushImage from '../assets/profile-ayush.jpg'
import JheelImage from '../assets/profile-jheel.jpeg'
import PraneetImage from '../assets/profile-praneet.jpeg'
import UzairImage from '../assets/profile-uzair.jpg'


const About = () => {
    const teamMembers = [
        { name: "Ayush Setpal", email: "as8675@g.rit.edu", imageUrl: AyushImage },
        { name: "Jheel Nikulkumar Patel", email: "jp9959@g.rit.edu" , imageUrl: JheelImage},
        { name: "Uzair Mukadam", email: "umm7905@g.rit.edu", imageUrl: UzairImage },
        { name: "Praneet Santhosh Naik", email: "pn3270@g.rit.edu",imageUrl: PraneetImage }
      ];

    return (
        <>
        <div className="about-div">
            <h1 className='about-tagline'>About</h1>
            <p className="about-content">Our proposed Inventory Management System (IMS) 
                is designed to address the complex needs of businesses 
                with <b>multiple warehouses</b> distributed across <b>various regions </b>
                within a country. 
                This system aims to streamline and enhance <b>inventory control, product management,</b> and <b>reporting capabilities,</b> providing an efficient solution for owners and managers. 
                It is a <b>single tenant application</b> which can be <b>tailored</b> and <b>deployed</b> according to each <b>customer’s requirements.</b>
            </p>
        </div>
        <center><h1 className='about-tagline'>Team</h1></center>
        <div className="about-container">
        {teamMembers.map((member, index) => (
        <div className="team-member" key={index}>
          <div className="profile-pic" style={{ backgroundImage: `url(${member.imageUrl})` }}></div>
          <h3>{member.name}</h3>
          <h4>{member.email}</h4>
          <p>{member.testimonial}</p>
        </div>
      ))}
    </div>
        </>
    );
};

export default About;