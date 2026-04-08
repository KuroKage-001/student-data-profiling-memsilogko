

## Student Profile Module - Add Student Profile



## Title: Email Address Field – Lowercase Validation

## Description:
When adding a new student, the Email Address field currently accepts uppercase letters. To
maintain data consistency and proper email formatting, the system should validate that the
email address is entered in lowercase letters only.

## Impact:
Allowing uppercase characters may lead to inconsistent data formatting and potential issues in
email processing or integrations.

## Recommendation / Suggested Improvement:
The system should display a validation error message if the email address contains uppercase
letters.

Example error message:
"Email address should be entered in lowercase letters only."





Title: Phone Number Field – Format and Input Validation
## Description:
The phone number field does not strictly enforce the required Philippine phone number format.
## Impact:
Users may enter invalid phone numbers, which can affect communication, notifications, or
account verification processes.

## Recommendation / Suggested Improvement:
The system should enforce the following validations:
● The phone number must start with “09” since the system is intended for
Philippine-based users.
● The phone number should contain exactly 11 digits only.
● The field should accept numbers only.
● If a user enters letters or other invalid characters, the system should display an error
message.
## Example Error Messages:
● "Phone number must start with 09."
● "Phone number must be exactly 11 digits."
● "Phone number should contain numbers only."



Title: GPA Field – Decimal Limit Validation

## Description:
The GPA field currently allows multiple decimal places.

## Impact:
Allowing more than two decimal places may result in inconsistent or inaccurate GPA data
formatting.

## Recommendation / Suggested Improvement:
The system should restrict GPA input to a maximum of two decimal places.

## Example:

## Valid: 3.50, 2.75
## Invalid: 3.567

Example error message:
"GPA should only contain up to two decimal places."





Title: Add New Student – Create Button Should Be Disabled for Invalid or Incomplete Inputs
## Description:
The Create button in the Add New Student form remains clickable even when the required
input fields do not meet the validation requirements or when some fields are incomplete.
## Impact:
Users may attempt to submit the form with invalid or incomplete information, which may lead to
incorrect data being saved or cause system validation errors.
## Recommendation / Suggested Improvement:
The system should disable the Create button by default and only enable it once all required
fields are properly filled out and meet the validation requirements.
The Create button should remain disabled if:
● Required fields are empty.
● The Email Address format is invalid.
● The Phone Number does not start with 09.
● The Phone Number is not exactly 11 digits.
● The Phone Number contains non-numeric characters.
● The GPA field contains more than two decimal places.
Once all inputs meet the required validations, the Create button should automatically
become enabled, allowing the user to submit the form.



















## Student Profile Module - View Student List



Title: Student List – Table/List Size and Visibility Improvement

## Description:
The current format of the Student List appears too small, making it difficult for users to
immediately view the list of students. The displayed list area may limit visibility, requiring
additional effort to view the information clearly.

## Impact:
Users may experience difficulty reading or quickly scanning the student list, which can affect
efficiency when managing or reviewing student records.

## Recommendation / Suggested Improvement:
The system should improve the layout of the Student List by increasing the size of the list or
table area to make the student records more visible. This may include:

● Expanding the list/table width or height.
● Adjusting the font size or row spacing for better readability.
● Ensuring the student list is clearly visible without requiring unnecessary scrolling or
zooming.

This improvement will enhance usability and readability when viewing the student records.

