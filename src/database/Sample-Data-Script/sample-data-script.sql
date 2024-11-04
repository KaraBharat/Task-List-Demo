

--
-- User profile sample data script
-- 
--

INSERT INTO public.user_profiles VALUES ('1ec704ca-c658-40e4-8ce9-a5ca79ddf994', NULL, 'Alice Johnson', 'alice.johnson@example.com', 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?q=80&w=2934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2024-10-20 07:57:12.518236', NULL, false, NULL);
INSERT INTO public.user_profiles VALUES ('f2fc5b85-3422-4431-868d-745830536f11', NULL, 'Bob Brown', 'bob.brown@example.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2024-10-20 07:57:13.228021', NULL, false, NULL);
INSERT INTO public.user_profiles VALUES ('a2ecc885-7009-4fd6-a1e5-380207d227df', NULL, 'Charlie Davis', 'charlie.davis@example.com', 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2024-10-20 07:57:13.461826', NULL, false, NULL);
INSERT INTO public.user_profiles VALUES ('7312a990-7c90-4df6-b1a9-287af88e5214', NULL, 'Diana Prince', 'diana.prince@example.com', 'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2024-10-20 07:57:13.69467', NULL, false, NULL);
INSERT INTO public.user_profiles VALUES ('9a06d977-c5d0-4540-bc7c-1178ef469613', NULL, 'Eve Adams', 'eve.adams@example.com', 'https://images.unsplash.com/photo-1564564295391-7f24f26f568b?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2024-10-20 07:57:13.925365', NULL, false, NULL);
INSERT INTO public.user_profiles VALUES ('1d298a3d-9602-449b-8cc7-b68658172337', NULL, 'Frank Miller', 'frank.miller@example.com', 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '2024-10-20 07:57:14.14755', NULL, false, NULL);




--
-- Task list sample data script
-- 

INSERT INTO public.tasks VALUES ('6b16fea4-3598-43f9-95a3-648c3f778c6e', 'TLM-1100', 'Implement Two-Factor Authentication', 'in_progress', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Implement a robust two-factor authentication (2FA) system to enhance the security of user accounts and protect sensitive data.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Integrate SMS-based and authenticator app-based 2FA options</li>
      <li>Implement secure token generation and validation</li>
      <li>Create a user-friendly 2FA setup process</li>
      <li>Develop fallback mechanisms for account recovery</li>
      <li>Ensure compliance with security best practices</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Research and select a suitable 2FA library or service</li>
      <li>Implement backend logic for 2FA enrollment and verification</li>
      <li>Design and develop UI for 2FA setup and login processes</li>
      <li>Integrate 2FA with existing authentication flow</li>
      <li>Implement account recovery options (e.g., backup codes)</li>
      <li>Conduct thorough security testing and auditing</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Users can enable 2FA using either SMS or authenticator app</li>
      <li>2FA verification is required upon login for enabled accounts</li>
      <li>Users can disable 2FA with proper authentication</li>
      <li>Account recovery mechanisms are in place and functional</li>
      <li>2FA implementation passes security audit and penetration testing</li>
    </ul>', '2024-10-15 23:59:59', '1ec704ca-c658-40e4-8ce9-a5ca79ddf994', 'f2fc5b85-3422-4431-868d-745830536f11', 8, NULL, 12, 'high', 'task', '2024-10-01 09:00:00', '2024-10-05 14:30:00', false, NULL);
INSERT INTO public.tasks VALUES ('7ecca845-47f1-4037-b361-03c1015cd167', 'TLM-1101', 'Optimize Database Queries for Product Listing', 'todo', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Optimize the database queries used in the product listing page to improve page load times and overall performance.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Current Issues</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Slow page load times, especially with large product catalogs</li>
      <li>Inefficient joins causing performance bottlenecks</li>
      <li>Lack of proper indexing on frequently queried columns</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Proposed Solutions</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Analyze and optimize existing queries using EXPLAIN ANALYZE</li>
      <li>Implement database indexing on frequently used columns</li>
      <li>Consider using materialized views for complex aggregations</li>
      <li>Implement query caching where appropriate</li>
      <li>Optimize JOIN operations and consider denormalization where necessary</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Page load time for product listing reduced by at least 50%</li>
      <li>Query execution time for main product listing query under 100ms</li>
      <li>No negative impact on data integrity or other functionalities</li>
      <li>Optimizations are well-documented for future maintenance</li>
    </ul>', '2024-10-10 23:59:59', 'a2ecc885-7009-4fd6-a1e5-380207d227df', '1ec704ca-c658-40e4-8ce9-a5ca79ddf994', 5, NULL, 0, 'high', 'task', '2024-10-02 11:00:00', '2024-10-02 11:00:00', false, NULL);
INSERT INTO public.tasks VALUES ('b2c8b66f-5924-4dac-9ba0-778074e4422c', 'TLM-1102', 'Implement Dark Mode for Mobile App', 'in_progress', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Implement a dark mode feature for our mobile app to enhance user experience in low-light environments and provide a modern, customizable interface.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Create a dark color palette that complements the existing design</li>
      <li>Implement a toggle for users to switch between light and dark modes</li>
      <li>Ensure all UI elements and text are clearly visible in dark mode</li>
      <li>Add option to follow system-wide dark mode settings</li>
      <li>Persist user''s dark mode preference</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Design dark mode color scheme and get approval from the design team</li>
      <li>Implement theming system in the app architecture</li>
      <li>Create dark mode variants for all existing UI components</li>
      <li>Add dark mode toggle in app settings</li>
      <li>Implement logic to apply dark mode system-wide</li>
      <li>Test dark mode on various devices and screen sizes</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Users can toggle between light and dark modes</li>
      <li>All app screens and components support dark mode</li>
      <li>Dark mode respects system-wide settings when enabled</li>
      <li>User''s dark mode preference is saved and applied on app restart</li>
      <li>Dark mode doesn''t negatively impact app performance</li>
    </ul>', '2024-10-12 23:59:59', '7312a990-7c90-4df6-b1a9-287af88e5214', '9a06d977-c5d0-4540-bc7c-1178ef469613', 8, NULL, 6, 'medium', 'task', '2024-09-28 13:00:00', '2024-10-03 09:15:00', false, NULL);
INSERT INTO public.tasks VALUES ('11764af2-2c39-4f5b-8fec-93981b4d547c', 'TLM-1103', 'Implement Real-time Chat Feature', 'todo', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Implement a real-time chat feature to enable instant communication between users, enhancing collaboration and user engagement within the application.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Develop a real-time messaging system using WebSockets</li>
      <li>Implement one-on-one and group chat functionalities</li>
      <li>Add support for text messages, emojis, and file attachments</li>
      <li>Implement message persistence and history</li>
      <li>Add read receipts and typing indicators</li>
      <li>Ensure proper error handling and offline support</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Set up WebSocket server using a suitable technology (e.g., Socket.io)</li>
      <li>Design and implement the chat UI components</li>
      <li>Develop backend APIs for message handling and storage</li>
      <li>Implement real-time message delivery and synchronization</li>
      <li>Add support for file uploads and attachments</li>
      <li>Implement typing indicators and read receipts</li>
      <li>Develop offline support and message queueing</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Users can send and receive messages in real-time</li>
      <li>Support for one-on-one and group chats</li>
      <li>Ability to send text messages, emojis, and file attachments</li>
      <li>Message history is properly stored and can be retrieved</li>
      <li>Typing indicators and read receipts are functional</li>
      <li>Chat works reliably in various network conditions</li>
    </ul>', '2024-10-25 23:59:59', 'f2fc5b85-3422-4431-868d-745830536f11', '1d298a3d-9602-449b-8cc7-b68658172337', 13, NULL, 0, 'high', 'task', '2024-10-04 09:30:00', '2024-10-04 09:30:00', false, NULL);
INSERT INTO public.tasks VALUES ('75064a47-605a-467f-82cf-52a6cdbc94d9', 'TLM-1104', 'Implement Multi-language Support', 'in_progress', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Implement multi-language support to make our application accessible to a global audience and improve user experience for non-English speaking users.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Implement i18n (internationalization) framework</li>
      <li>Create translation files for at least 5 major languages</li>
      <li>Develop a language selection mechanism in the user settings</li>
      <li>Ensure all UI elements, including dynamic content, support translation</li>
      <li>Implement right-to-left (RTL) layout support for applicable languages</li>
      <li>Localize date, time, and number formats</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Set up i18n framework (e.g., react-i18next for React applications)</li>
      <li>Extract all hardcoded strings into translation keys</li>
      <li>Create translation files for English, Spanish, French, German, and Mandarin</li>
      <li>Implement language switching functionality in the UI</li>
      <li>Adapt layouts and styles to support RTL languages</li>
      <li>Implement localized formatting for dates, times, and numbers</li>
      <li>Set up a translation management system for future updates</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Application supports at least 5 languages</li>
      <li>Users can easily switch between languages</li>
      <li>All UI elements and dynamic content are properly translated</li>
      <li>RTL layout is correctly implemented for applicable languages</li>
      <li>Date, time, and number formats are localized</li>
      <li>No untranslated strings appear in the UI</li>
    </ul>', '2024-10-15 23:59:59', 'a2ecc885-7009-4fd6-a1e5-380207d227df', '1ec704ca-c658-40e4-8ce9-a5ca79ddf994', 8, NULL, 20, 'medium', 'task', '2024-09-20 10:00:00', '2024-10-02 11:30:00', false, NULL);
INSERT INTO public.tasks VALUES ('65066dd1-1d59-41b1-8cb0-c0561a653939', 'TLM-1105', 'Implement CI/CD Pipeline', 'todo', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Implement a robust CI/CD pipeline to automate the build, test, and deployment processes, improving development efficiency and reducing the risk of errors in production.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Set up automated build process for all project components</li>
      <li>Implement automated unit and integration testing</li>
      <li>Configure static code analysis and linting</li>
      <li>Set up automated deployment to staging and production environments</li>
      <li>Implement rollback mechanisms for failed deployments</li>
      <li>Configure notifications for build and deployment status</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Choose and set up a CI/CD tool (e.g., Jenkins, GitLab CI, or GitHub Actions)</li>
      <li>Configure build jobs for each project component</li>
      <li>Set up automated test execution as part of the pipeline</li>
      <li>Integrate code quality tools (e.g., SonarQube) into the pipeline</li>
      <li>Configure deployment jobs for staging and production environments</li>
      <li>Implement approval gates for production deployments</li>
      <li>Set up monitoring and alerting for the CI/CD pipeline</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Automated builds are triggered on code commits</li>
      <li>All tests are automatically run as part of the pipeline</li>
      <li>Code quality checks are performed automatically</li>
      <li>Successful builds are automatically deployed to the staging environment</li>
      <li>Production deployments require manual approval</li>
      <li>Failed builds or deployments trigger notifications to the team</li>
      <li>Rollback process is in place and tested</li>
    </ul>', '2024-10-20 23:59:59', '1d298a3d-9602-449b-8cc7-b68658172337', 'f2fc5b85-3422-4431-868d-745830536f11', 13, NULL, 0, 'high', 'task', '2024-10-05 11:00:00', '2024-10-05 11:00:00', false, NULL);
INSERT INTO public.tasks VALUES ('aa307875-5a1a-45f8-9ed2-97445990bf27', 'TLM-1107', 'Implement Data Analytics Dashboard', 'todo', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Create a powerful and intuitive data analytics dashboard that provides valuable insights into user behavior, application performance, and business metrics to support data-driven decision making.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Design and implement a user-friendly dashboard interface</li>
      <li>Integrate with existing data sources and APIs</li>
      <li>Develop visualizations for key performance indicators (KPIs)</li>
      <li>Implement real-time data updates where applicable</li>
      <li>Create customizable reports and export functionality</li>
      <li>Ensure proper data security and access controls</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Select and integrate a suitable data visualization library</li>
      <li>Design the dashboard layout and user interface</li>
      <li>Implement data fetching and processing logic</li>
      <li>Develop interactive charts and graphs for various metrics</li>
      <li>Create filtering and date range selection functionality</li>
      <li>Implement user authentication and authorization for dashboard access</li>
      <li>Develop export functionality for reports in various formats (PDF, CSV)</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Dashboard displays accurate and up-to-date data</li>
      <li>Users can interact with visualizations to drill down into data</li>
      <li>Custom date ranges can be selected for data analysis</li>
      <li>Reports can be generated and exported in multiple formats</li>
      <li>Dashboard is responsive and performs well with large datasets</li>
      <li>Proper access controls are in place to protect sensitive data</li>
    </ul>', '2024-11-15 23:59:59', '9a06d977-c5d0-4540-bc7c-1178ef469613', '1d298a3d-9602-449b-8cc7-b68658172337', 13, NULL, 0, 'high', 'task', '2024-10-06 10:00:00', '2024-10-06 10:00:00', false, NULL);
INSERT INTO public.tasks VALUES ('d3366833-3faf-46b2-b4f3-7003bfc23022', 'TLM-1110', 'Implement Automated Backup System', 'todo', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Create a robust and automated backup system to safeguard critical data, ensure business continuity, and enable quick disaster recovery in case of data loss or system failures.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Implement automated daily backups of all critical data</li>
      <li>Set up incremental backups for efficient storage use</li>
      <li>Ensure data encryption for backups at rest and in transit</li>
      <li>Implement backup verification and integrity checks</li>
      <li>Set up off-site backup storage for disaster recovery</li>
      <li>Create a user-friendly backup restoration process</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Select and set up a backup solution (e.g., Bacula, Amanda, or cloud-based solutions)</li>
      <li>Configure backup schedules for different data types</li>
      <li>Implement incremental backup logic</li>
      <li>Set up encryption for backup data</li>
      <li>Develop scripts for backup integrity checks</li>
      <li>Configure off-site backup storage (e.g., cloud storage)</li>
      <li>Create documentation for the backup and restoration processes</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Daily backups are performed automatically without manual intervention</li>
      <li>Incremental backups are working correctly and saving storage space</li>
      <li>All backup data is properly encrypted</li>
      <li>Integrity checks are performed on backups and results are logged</li>
      <li>Off-site backups are configured and syncing correctly</li>
      <li>Restoration process is documented and tested successfully</li>
    </ul>', '2024-11-05 23:59:59', '1d298a3d-9602-449b-8cc7-b68658172337', 'f2fc5b85-3422-4431-868d-745830536f11', 8, NULL, 0, 'high', 'task', '2024-10-15 10:00:00', '2024-10-15 10:00:00', false, NULL);
INSERT INTO public.tasks VALUES ('2fcfca78-0928-4683-9563-bac4c38e8cd1', 'TLM-1108', 'Implement User Onboarding Flow', 'in_progress', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Create an engaging and informative user onboarding experience that guides new users through key features of the application, improving user activation and long-term retention.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Design an interactive step-by-step onboarding flow</li>
      <li>Highlight key features and functionality of the application</li>
      <li>Implement progress tracking for onboarding steps</li>
      <li>Create engaging animations and transitions</li>
      <li>Allow users to skip or revisit onboarding steps</li>
      <li>Collect essential user preferences during onboarding</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Design wireframes and mockups for onboarding screens</li>
      <li>Develop reusable components for onboarding steps</li>
      <li>Implement navigation logic between onboarding steps</li>
      <li>Create animations for transitions and feature highlights</li>
      <li>Integrate with user profile API to save preferences</li>
      <li>Implement analytics tracking for onboarding completion rates</li>
      <li>Conduct user testing and gather feedback for iterations</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>New users are presented with the onboarding flow upon first login</li>
      <li>Users can navigate forward and backward through onboarding steps</li>
      <li>Key features are clearly explained with visual aids</li>
      <li>User preferences are correctly saved and applied</li>
      <li>Onboarding flow is skippable and can be accessed later from settings</li>
      <li>Analytics events are triggered for each completed onboarding step</li>
    </ul>', '2024-10-25 23:59:59', '7312a990-7c90-4df6-b1a9-287af88e5214', '1ec704ca-c658-40e4-8ce9-a5ca79ddf994', 8, NULL, 10, 'high', 'task', '2024-10-08 09:00:00', '2024-10-10 14:30:00', false, NULL);
INSERT INTO public.tasks VALUES ('72548b62-f5ba-4f5a-8b90-fee667d408c1', 'TLM-1109', 'Implement Advanced Search Functionality', 'todo', '<h2 style="font-size: 16px; color: #333; margin-bottom: 10px; font-weight: bold;">Objective</h2>
    <p style="font-size: 14px; color: #555;">Implement a powerful and flexible advanced search functionality that allows users to efficiently find and filter content, improving overall user experience and productivity.</p>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Requirements</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Develop a user-friendly advanced search interface</li>
      <li>Implement multiple filter options (e.g., date range, categories, tags)</li>
      <li>Add sorting capabilities for search results</li>
      <li>Create saved search functionality for frequent queries</li>
      <li>Implement type-ahead suggestions for search terms</li>
      <li>Optimize search performance for large datasets</li>
    </ul>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Implementation Details</h2>
    <ol style="list-style-type: decimal; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Design and implement the advanced search UI components</li>
      <li>Develop backend API endpoints for advanced search queries</li>
      <li>Implement filter logic for various data types</li>
      <li>Create sorting functionality for search results</li>
      <li>Develop saved search feature with user preferences</li>
      <li>Implement type-ahead suggestions using an efficient algorithm</li>
      <li>Optimize database queries and consider caching for performance</li>
    </ol>

    <h2 style="font-size: 16px; color: #333; margin-top: 15px; margin-bottom: 10px; font-weight: bold;">Acceptance Criteria</h2>
    <ul style="list-style-type: disc; padding-left: 20px; font-size: 14px; color: #555;">
      <li>Users can perform advanced searches with multiple filters</li>
      <li>Search results can be sorted by relevant criteria</li>
      <li>Users can save and manage their frequent searches</li>
      <li>Type-ahead suggestions are provided for search terms</li>
      <li>Search performance is optimized for large datasets</li>
      <li>Advanced search UI is intuitive and responsive</li>
    </ul>', '2024-11-10 23:59:59', 'f2fc5b85-3422-4431-868d-745830536f11', 'a2ecc885-7009-4fd6-a1e5-380207d227df', 13, NULL, 0, 'medium', 'task', '2024-10-12 11:00:00', '2024-10-12 11:00:00', false, NULL);
INSERT INTO public.tasks VALUES ('e1d1e0ec-9b6a-4ff7-a33c-8258d9282258', 'TLM-1119', 'Both product data are used as the Elasticsearch database.', 'todo', '<p class="text-node">The main feature of the database Elasticsearch is that it is specialized for instant search. If you use a standard framework for logging, it will have extensions by default that can ensure that all test logs are sent to the database Elasticsearch.</p><p class="text-node"></p><p class="text-node">What are the advantages of sending logs to a dedicated database:</p><p class="text-node"></p><ul class="list-node"><li><p class="text-node">The logs will not be erased or lost.</p></li><li><p class="text-node">Easily accessible (View logs in the accessible user interface).</p></li><li><p class="text-node">Instant Search (Thanks to Elastic Search).</p></li></ul>', NULL, 'f2fc5b85-3422-4431-868d-745830536f11', NULL, 1, NULL, NULL, 'medium', 'task', '2024-10-23 06:36:22.647544', '2024-10-23 06:36:22.647544', false, NULL);
INSERT INTO public.tasks VALUES ('c03f0bd9-30d1-4635-872a-5c227a2fae72', 'TLM-1125', 'Configure Automated Project Status Reporting', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: Set up an automated reporting system to track and share project status updates, including sprint progress, burn-down charts, and blockers. Integrate this reporting with Jira, Slack, and email notifications to ensure timely updates are available to the team and stakeholders.</p></li><li><p class="text-node"><strong>Acceptance Criteria</strong>:</p><ol class="list-node"><li><p class="text-node">Automated reports generated at the end of each sprint.</p></li><li><p class="text-node">Reports include sprint progress, remaining tasks, team velocity, and blockers.</p></li><li><p class="text-node">Stakeholders receive email and Slack notifications with report summaries.</p></li></ol></li></ul>', NULL, '7312a990-7c90-4df6-b1a9-287af88e5214', NULL, NULL, NULL, NULL, 'medium', 'task', '2024-10-24 13:01:16.966587', '2024-10-24 13:01:16.966587', false, NULL);
INSERT INTO public.tasks VALUES ('1ba5a1a1-3ea3-4698-a1df-b4f26c7bfbd6', 'TLM-1132', 'Establish Project Retrospective Schedule', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: Plan and schedule regular project retrospectives at the end of each sprint. Ensure that retrospectives provide a platform for the team to reflect on what went well, what could be improved, and actions for the next sprint. Gather feedback and implement continuous improvement strategies based on the outcomes of these meetings.</p></li><li><p class="text-node"><strong>Acceptance Criteria</strong>:</p><ol class="list-node"><li><p class="text-node">Retrospectives are scheduled and recurring every sprint end.</p></li><li><p class="text-node">Meeting agendas and outcome documents are saved in the project folder.</p></li><li><p class="text-node">Action items from retrospectives are added to the backlog.</p></li></ol></li></ul>', NULL, '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', NULL, NULL, NULL, 'medium', 'task', '2024-10-25 08:15:01.00217', '2024-10-25 08:15:01.00217', false, NULL);
INSERT INTO public.tasks VALUES ('5113a863-ff51-467d-9f18-8a65a86e7117', 'TLM-1134', 'Incorrect Total Amount in Cart Summary', 'in_progress', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: The cart total does not include the applied discount, showing the original total instead of the discounted amount.</p></li><li><p class="text-node"><strong>Steps to Reproduce</strong>:</p><ol class="list-node"><li><p class="text-node">Add items to the cart.</p></li><li><p class="text-node">Apply a valid discount code.</p></li><li><p class="text-node">Navigate to the cart summary page.</p></li></ol></li><li><p class="text-node"><strong>Expected Behavior</strong>: The total amount should reflect the discount.</p></li><li><p class="text-node"><strong>Actual Behavior</strong>: The total amount shown is the pre-discounted total.</p></li></ul>', '2024-10-30 18:30:00', '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', NULL, NULL, NULL, 'medium', 'bug', '2024-10-25 08:17:05.470921', '2024-10-25 08:17:05.470921', false, NULL);
INSERT INTO public.tasks VALUES ('54090596-8836-4b6e-8c8b-d693ce31880b', 'TLM-1135', 'Content SEO and Optimization', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>AI-Enhanced SEO</strong>: AI can analyze search patterns and keyword effectiveness, helping marketers create SEO-optimized content that ranks well in search engines. Google’s algorithms use AI to understand intent, making SEO strategies more focused on user needs.</p></li><li><p class="text-node"><strong>Voice Search Optimization</strong>: With AI-driven voice recognition technologies like Siri and Alexa, optimizing content for voice search has become a priority, requiring marketers to create conversational, query-based content.</p></li></ul>', NULL, 'a2ecc885-7009-4fd6-a1e5-380207d227df', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'story', '2024-10-26 08:14:18.801705', '2024-10-26 08:14:18.801705', false, NULL);
INSERT INTO public.tasks VALUES ('9bfda686-6bc9-4b3f-a9f1-d433e46569ce', 'TLM-1139', 'Dropdown Menu Not Closing on Outside Click', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: When a user clicks outside the dropdown menu, the menu does not close as expected.</p></li><li><p class="text-node"><strong>Steps to Reproduce</strong>:</p><ol class="list-node"><li><p class="text-node">Open the dropdown menu.</p></li><li><p class="text-node">Click anywhere outside the dropdown.</p></li></ol></li><li><p class="text-node"><strong>Expected Behavior</strong>: The dropdown should close when clicking outside of it.</p></li><li><p class="text-node"><strong>Actual Behavior</strong>: The dropdown remains open until an option is selected.</p></li></ul>', NULL, '1d298a3d-9602-449b-8cc7-b68658172337', '1d298a3d-9602-449b-8cc7-b68658172337', 5, 10, 5, 'medium', 'task', '2024-10-26 09:44:57.964626', '2024-10-26 09:44:57.964626', false, NULL);
INSERT INTO public.tasks VALUES ('ee3c6678-f802-4299-a5be-49edede520d3', 'TLM-1137', 'Broken Links in the Footer Section', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: Several links in the footer section redirect to 404 error pages instead of the correct destination.</p></li><li><p class="text-node"><strong>Steps to Reproduce</strong>:</p><ol class="list-node"><li><p class="text-node">Scroll to the footer on any page.</p></li><li><p class="text-node">Click on any of the links in the footer (e.g., Privacy Policy, Terms of Service).</p></li></ol></li><li><p class="text-node"><strong>Expected Behavior</strong>: Links should redirect to the correct pages.</p></li><li><p class="text-node"><strong>Actual Behavior</strong>: Links redirect to a 404 error page.</p></li></ul>', '2024-10-29 18:30:00', '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', NULL, NULL, NULL, 'medium', 'bug', '2024-10-26 08:49:04.391849', '2024-10-26 08:49:04.391849', false, NULL);
INSERT INTO public.tasks VALUES ('28312822-048f-4814-83f8-f21751cace8d', 'TLM-1136', 'Search Function Returns No Results for Exact Matches', 'in_progress', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: The search function fails to return results even when an exact match exists in the database.</p></li><li><p class="text-node"><strong>Steps to Reproduce</strong>:</p><ol class="list-node"><li><p class="text-node">Perform a search with an exact match for an item.</p></li><li><p class="text-node">Observe the "No Results Found" message.</p></li></ol></li><li><p class="text-node"><strong>Expected Behavior</strong>: The search should return results for exact matches.</p></li><li><p class="text-node"><strong>Current Behavior</strong>: no results.</p></li><li><p class="text-node"><strong>Actual Behavior</strong>: The search returns no results.</p></li></ul>', '2024-11-19 18:30:00', '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'bug', '2024-10-26 08:45:21.481075', '2024-10-26 08:45:21.481075', false, NULL);
INSERT INTO public.tasks VALUES ('154a7874-240d-4cd8-ad07-bdcd5f3f64c9', 'TLM-1133', 'Login Form Not Submitting When Pressing Enter Key', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: Users are unable to submit the login form by pressing the Enter key; they must click the “Login” button to proceed.</p></li><li><p class="text-node"><strong>Steps to Reproduce</strong>:</p><ol class="list-node"><li><p class="text-node">Navigate to the login page.</p></li><li><p class="text-node">Enter valid credentials.</p></li><li><p class="text-node">Press the "Enter" key.</p></li></ol></li><li><p class="text-node"><strong>Expected Behavior</strong>: The form should submit and log the user in when the Enter key is pressed.</p></li><li><p class="text-node"><strong>Actual Behavior</strong>: The form does not submit when pressing Enter.</p></li><li><p class="text-node"></p><ol class="list-node"><li><p class="text-node">Navigate to the login page.</p></li><li><p class="text-node">Enter valid credentials.</p></li><li><p class="text-node">Press the "Enter" key.</p></li></ol></li></ul>', '2024-11-19 18:30:00', '9a06d977-c5d0-4540-bc7c-1178ef469613', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-10-25 08:16:39.032513', '2024-10-25 08:16:39.032513', false, NULL);
INSERT INTO public.tasks VALUES ('f3daa6f6-d0ae-4b6d-b6b0-d22988a1b391', 'TLM-1140', '435435', 'todo', '<p class="text-node">435435</p>', NULL, '9a06d977-c5d0-4540-bc7c-1178ef469613', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 11:54:04.457846', NULL, true, '2024-11-04 11:54:13.429');
INSERT INTO public.tasks VALUES ('97f6b960-8cad-46ca-8218-c70bbde310df', 'TLM-1141', '324', 'todo', '<p class="text-node">retert</p>', NULL, '1d298a3d-9602-449b-8cc7-b68658172337', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 11:54:35.848303', NULL, true, '2024-11-04 12:03:16.187');
INSERT INTO public.tasks VALUES ('13b03a4b-937a-471f-9099-f06ce7465a99', 'TLM-1142', '64536', 'todo', '<p class="text-node">3434</p>', NULL, '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 11:54:46.584272', NULL, true, '2024-11-04 12:03:16.187');
INSERT INTO public.tasks VALUES ('f82ac60b-e6fe-401d-974a-62a64823e20d', 'TLM-1138', 'User Registration via Social Media Accounts', 'todo', '<ul class="list-node"><li><p class="text-node"><strong>Description</strong>: As a user, I want to register using my social media accounts (Google, Facebook) so that I can quickly sign up without manually entering my information.</p></li><li><p class="text-node"><strong>Acceptance Criteria</strong>:</p><ol class="list-node"><li><p class="text-node">Users can sign up using their Google and Facebook accounts.</p></li><li><p class="text-node">The system pulls necessary information like name and email from social media accounts.</p></li><li><p class="text-node">The registration is completed without requiring additional information.</p></li><li><p class="text-node">Users can sign up using their Google and Facebook accounts.</p></li><li><p class="text-node">The system pulls necessary information like name and email from social media accounts.</p></li><li><p class="text-node">Users can sign up using their Google and Facebook accounts.</p></li><li><p class="text-node">Users can sign up using their Google and Facebook accounts.</p></li></ol></li></ul>', '2024-10-31 18:30:00', 'a2ecc885-7009-4fd6-a1e5-380207d227df', '1d298a3d-9602-449b-8cc7-b68658172337', 8, 8, 3, 'medium', 'task', '2024-10-26 08:50:44.252586', '2024-10-26 08:50:44.252586', false, NULL);
INSERT INTO public.tasks VALUES ('27b66cea-2287-46bc-8f61-8ee4bd96ab93', 'TLM-1143', '345', 'todo', '<p class="text-node">435</p>', NULL, '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 12:36:47.648123', NULL, true, '2024-11-04 12:40:26.026');
INSERT INTO public.tasks VALUES ('61ae8e8d-04ef-46b4-a315-48dbb5839c9b', 'TLM-1144', '234', 'todo', '<p class="text-node">324</p>', NULL, 'a2ecc885-7009-4fd6-a1e5-380207d227df', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 12:50:39.222887', NULL, true, '2024-11-04 12:50:53.821');
INSERT INTO public.tasks VALUES ('d810eb28-bbaa-480a-b294-3f4bbad5bdec', 'TLM-1145', '5656', 'todo', '<p class="text-node">456</p>', NULL, '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 12:50:48.495544', NULL, true, '2024-11-04 12:51:05.403');
INSERT INTO public.tasks VALUES ('397b3228-0ffc-4089-a33f-5fd643fd4867', 'TLM-1146', '43545', 'todo', '<p class="text-node">rtyry</p>', NULL, '7312a990-7c90-4df6-b1a9-287af88e5214', '1d298a3d-9602-449b-8cc7-b68658172337', 1, 0, 0, 'medium', 'task', '2024-11-04 12:51:25.491135', NULL, true, '2024-11-04 12:51:37.414');

