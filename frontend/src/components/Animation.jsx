/*eslint-disable */
import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import LoadingBar from 'react-top-loading-bar'
import animationData from '../assets/Animation - 1725979956276.json';

const MyLottieAnimation = ({ handleAnimation, socket }) => {

    const [progress, setProgress] = useState(0)

    useEffect(()=>{
        const handleProgress = (prog) =>{
            setProgress(prog.progress)
        }
        socket.on('progress', handleProgress);
        return () =>{
            socket.off('progress', handleProgress);
        }

    },[progress]);

    function handleAnimationLoading() {
        handleAnimation(false);
    }

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className='animation-background'>
                <Lottie
                    className='animation'
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    style={{ width: 300, height: 300 }}
                />
                <div >
                    <i onClick={handleAnimationLoading} className="bi bi-x-circle"></i>
                </div>
            </div>
        </>
    );
};

export default MyLottieAnimation;

