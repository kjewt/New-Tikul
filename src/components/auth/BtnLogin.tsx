import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { firebaseAuth, db } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { accountDataState } from '../../state/atoms';

type PropsType = { email: string, password: string }

export const BtnLogin = ({ email, password }: PropsType): JSX.Element => {
    const navigate = useNavigate();
    const user = firebaseAuth.currentUser;
    const [isLogin, setIsLogin] = useState<boolean>(false)
    const [accountData, setAccountData] = useRecoilState(accountDataState)

    const userRef = user ? doc(db, "users", user.uid) : null;

    const Login = async () => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            console.log('로그인 성공!');
            setIsLogin(true);
            if (userRef) {
                getDoc(userRef).then((doc: any) => {
                    if (doc.exists) {
                        setAccountData(doc.data())
                        console.log("Document data:", accountData);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error: Error) => {
                    console.log("Error getting document:", error);
                });
                // const accountDoc = await getDoc(userRef);
                // const data = accountDoc.data();
                // const detail = collection(userRef, 'details');
                // if (data) {
                //     setAccountData({
                //         IsRegister: false,
                //         account: null,
                //         accountPW: null,
                //         balance: 0,
                //         bank: null,
                //         email: null,
                //     });
                // }


                navigate('/Home'); // 회원가입 성공 후 로그인 페이지로 이동
            }
        } catch (error) {
            console.log('로그인 실패', error);
            setIsLogin(false);
        }
    };



    // if (user) {
    //     localStorage.setItem('account', JSON.stringify(accountData));
    //     localStorage.setItem('uid', JSON.stringify(user.uid));
    //     console.log(accountData)
    // }

    console.log(isLogin);



    return (
        <>


            <div className="form-control my-6">
                <button className="btn btn-primary" onClick={Login}>Login</button>
                <label className="label justify-center mt-2">
                    <span className="text-sm mr-2">아직 회원이 아니라면 지금 바로</span>
                    <Link to="join" className="link-hover text-sm text-primary">가입하세요</Link>
                </label>
            </div>

        </>
    );
};

