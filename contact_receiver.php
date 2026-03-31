<?php
header("Content-Type: text/html; charset=UTF-8");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// 1. POST 데이터 수신 (문의 유형 추가)
$inquiry_type = isset($_POST['inquiry_type']) ? htmlspecialchars($_POST['inquiry_type']) : '미선택';
$name         = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
$phone        = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '';
$address      = isset($_POST['address']) ? htmlspecialchars($_POST['address']) : '미입력';
$msg          = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';

// 2. 필수 항목 검증
if (empty($name) || empty($phone) || empty($msg)) {
    echo "fail: 필수 항목 누락";
    exit;
}

$mail = new PHPMailer(true);

try {
    // 3. SMTP 서버 설정
    $mail->isSMTP();
    $mail->SMTPDebug  = 0;                        
    $mail->Host       = 'smtps.hiworks.com';
    $mail->SMTPAuth   = true;                     
    $mail->Username   = 'admin@koreaevs.co.kr';   
    $mail->Password   = 'ZCXB864RPjAKvfOhmRqf';   
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
    $mail->Port       = 465;                      
    $mail->CharSet    = 'UTF-8';

    // 4. 발신자 및 수신자 설정
    $mail->setFrom('admin@koreaevs.co.kr', '한국EVS'); 
    $mail->addAddress('koreaevs@koreaevs.co.kr');           
    $mail->addAddress('smhyun@koreaevs.co.kr');               

    // 5. 메일 본문 및 제목 구성 (요청하신 사항 반영)
    $mail->isHTML(true);
    
    // 메일 제목: [선택한 문의유형] 성함 님의 문의가 접수되었습니다.
    $mail->Subject = "[{$inquiry_type}] {$name}님의 문의가 접수되었습니다.";
    
    // 메일 본문 디자인
    $mail->Body    = "
        <div style='padding:25px; border:1px solid #e5e7eb; border-radius: 8px; font-family: \"Malgun Gothic\", sans-serif; max-width: 600px;'>
            <h2 style='color: #1e3a8a; margin-top: 0;'>홈페이지 상담 문의 내역</h2>
            <hr style='border: 0; border-top: 2px solid #f3f4f6; margin: 20px 0;'>
            
            <p style='font-size: 15px; margin-bottom: 10px;'><b>문의 유형:</b> <span style='color: #2563eb; font-weight: bold;'>{$inquiry_type}</span></p>
            <p style='font-size: 15px; margin-bottom: 10px;'><b>성함:</b> {$name}</p>
            <p style='font-size: 15px; margin-bottom: 10px;'><b>연락처:</b> {$phone}</p>
            <p style='font-size: 15px; margin-bottom: 10px;'><b>부지 주소:</b> {$address}</p>
            
            <div style='background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 25px;'>
                <b style='font-size: 15px; display: block; margin-bottom: 10px;'>문의 내용:</b>
                <p style='margin: 0; line-height: 1.6; color: #374151; font-size: 14px;'>" . nl2br($msg) . "</p>
            </div>
        </div>
    ";

    $mail->send();
    echo "success";

} catch (Exception $e) {
    // 실패 시 상세 에러
    echo "fail: " . $mail->ErrorInfo;
}
?>